"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, FolderKanban, X, Tag, DollarSign } from "lucide-react";

type BulkScope = "selected" | "category" | "all";
type BulkMode = "fixed" | "percentage" | "amount";
type BulkDirection = "increase" | "decrease";

export default function ThemesPage() {
  const router = useRouter();
  const [themes, setThemes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  // SEARCH & FILTER
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  // ADD Theme
  const [addModal, setAddModal] = useState(false);
  const [addData, setAddData] = useState({
    name: "",
    price: "",
    demoUrl: "",
    categoryIds: [] as number[],
    tagIds: [] as number[],
    image: null as File | null,
  });

  // EDIT Theme
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState<any>({});

  // DELETE Theme
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // THEME SETTINGS
  const [showPrice, setShowPrice] = useState(true);

  // BULK PRICE UPDATE
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkModal, setBulkModal] = useState(false);
  const [bulkScope, setBulkScope] = useState<BulkScope>("selected");
  const [bulkMode, setBulkMode] = useState<BulkMode>("fixed");
  const [bulkValue, setBulkValue] = useState("");
  const [bulkDirection, setBulkDirection] = useState<BulkDirection>("increase");
  const [bulkCategoryId, setBulkCategoryId] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);

  // LOAD DATA
  const loadData = useCallback(async () => {
    try {
      const res = await fetch("/api/themes");
      const data = await res.json();
      setThemes(data.data || []);

      const resCat = await fetch("/api/categories");
      const catData = await resCat.json();
      setCategories(Array.isArray(catData) ? catData : []);

      const resTags = await fetch("/api/tags");
      const tagsData = await resTags.json();
      setTags(Array.isArray(tagsData) ? tagsData : []);

      const resSettings = await fetch("/api/theme-settings");
      const settingsData = await resSettings.json();
      if (settingsData && settingsData.showPrice !== undefined) {
        setShowPrice(settingsData.showPrice);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      setThemes([]);
      setCategories([]);
      setTags([]);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // FILTERED & SEARCHED THEMES
  const filteredThemes = themes.filter((theme: any) => {
    const matchesSearch = theme.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategoryFilter === "all" ||
      theme.categories.some(
        (cat: any) => cat.id === Number(selectedCategoryFilter)
      );

    return matchesSearch && matchesCategory;
  });

  const filteredIds = filteredThemes.map((t: any) => t.id);
  const allFilteredSelected =
    filteredIds.length > 0 &&
    filteredIds.every((id: number) => selectedIds.includes(id));

  const bulkPreviewCount = useMemo(() => {
    if (bulkScope === "selected") return selectedIds.length;
    if (bulkScope === "category") {
      if (!bulkCategoryId) return 0;
      return themes.filter((t: any) =>
        t.categories.some((c: any) => c.id === Number(bulkCategoryId))
      ).length;
    }
    return themes.length;
  }, [bulkScope, selectedIds, bulkCategoryId, themes]);

  const toggleSelectTheme = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAllFiltered = () => {
    if (allFilteredSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !filteredIds.includes(id))
      );
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...filteredIds])]);
    }
  };

  const openBulkModal = () => {
    setBulkScope(selectedIds.length > 0 ? "selected" : "all");
    setBulkMode("fixed");
    setBulkValue("");
    setBulkDirection("increase");
    setBulkCategoryId(categories[0] ? String(categories[0].id) : "");
    setBulkModal(true);
  };

  const applyBulkPrice = async () => {
    const value = Number(bulkValue);
    if (!bulkValue || isNaN(value) || value < 0) {
      alert("Please enter a valid positive value");
      return;
    }

    if (bulkScope === "selected" && selectedIds.length === 0) {
      alert("Please select at least one theme");
      return;
    }

    if (bulkScope === "category" && !bulkCategoryId) {
      alert("Please select a category");
      return;
    }

    setBulkLoading(true);
    try {
      const res = await fetch("/api/themes/bulk-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope: bulkScope,
          themeIds: bulkScope === "selected" ? selectedIds : undefined,
          categoryId:
            bulkScope === "category" ? Number(bulkCategoryId) : undefined,
          mode: bulkMode,
          value,
          direction: bulkMode === "fixed" ? undefined : bulkDirection,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update prices");
        return;
      }

      alert(`Successfully updated ${data.updated} theme(s)`);
      setBulkModal(false);
      setSelectedIds([]);
      loadData();
    } catch (err) {
      console.error("Bulk price update failed:", err);
      alert("Failed to update prices");
    } finally {
      setBulkLoading(false);
    }
  };

  // TOGGLE CATEGORY (ADD)
  const toggleAddCategory = (categoryId: number) => {
    setAddData((prev) => {
      const isSelected = prev.categoryIds.includes(categoryId);
      return {
        ...prev,
        categoryIds: isSelected
          ? prev.categoryIds.filter((id) => id !== categoryId)
          : [...prev.categoryIds, categoryId],
      };
    });
  };

  // TOGGLE TAG (ADD)
  const toggleAddTag = (tagId: number) => {
    setAddData((prev) => {
      const isSelected = prev.tagIds.includes(tagId);
      return {
        ...prev,
        tagIds: isSelected
          ? prev.tagIds.filter((id) => id !== tagId)
          : [...prev.tagIds, tagId],
      };
    });
  };

  // TOGGLE CATEGORY (EDIT)
  const toggleEditCategory = (categoryId: number) => {
    setEditData((prev: any) => {
      const isSelected = prev.categoryIds.includes(categoryId);
      return {
        ...prev,
        categoryIds: isSelected
          ? prev.categoryIds.filter((id: number) => id !== categoryId)
          : [...prev.categoryIds, categoryId],
      };
    });
  };

  // TOGGLE TAG (EDIT)
  const toggleEditTag = (tagId: number) => {
    setEditData((prev: any) => {
      const isSelected = prev.tagIds.includes(tagId);
      return {
        ...prev,
        tagIds: isSelected
          ? prev.tagIds.filter((id: number) => id !== tagId)
          : [...prev.tagIds, tagId],
      };
    });
  };

  // ADD THEME
  const createTheme = async () => {
    if (addData.categoryIds.length === 0) {
      alert("Please select at least one category");
      return;
    }

    const fd = new FormData();
    fd.append("name", addData.name);
    fd.append("price", addData.price);
    fd.append("demoUrl", addData.demoUrl);
    fd.append("categoryIds", JSON.stringify(addData.categoryIds));
    fd.append("tagIds", JSON.stringify(addData.tagIds));

    if (addData.image) fd.append("image", addData.image);

    await fetch("/api/themes", {
      method: "POST",
      body: fd,
    });

    setAddModal(false);
    setAddData({
      name: "",
      price: "",
      demoUrl: "",
      categoryIds: [],
      tagIds: [],
      image: null,
    });
    loadData();
  };

  // OPEN EDIT MODAL
  const openEdit = (t: any) => {
    setEditData({
      ...t,
      price: String(t.price),
      categoryIds: t.categories.map((c: any) => c.id),
      tagIds: t.tags.map((tag: any) => tag.id),
      image: t.image,
    });
    setEditModal(true);
  };

  // UPDATE THEME
  const updateTheme = async () => {
    if (editData.categoryIds.length === 0) {
      alert("Please select at least one category");
      return;
    }

    const fd = new FormData();
    fd.append("name", editData.name);
    fd.append("price", editData.price);
    fd.append("demoUrl", editData.demoUrl);
    fd.append("categoryIds", JSON.stringify(editData.categoryIds));
    fd.append("tagIds", JSON.stringify(editData.tagIds));

    if (editData.image instanceof File) {
      fd.append("image", editData.image);
    } else {
      fd.append("keepExistingImage", "true");
    }

    await fetch(`/api/themes/${editData.id}`, {
      method: "PUT",
      body: fd,
    });

    setEditModal(false);
    loadData();
  };

  // DELETE
  const confirmDelete = async () => {
    await fetch(`/api/themes/${deleteId}`, {
      method: "DELETE",
    });

    setDeleteModal(false);
    loadData();
  };

  // TOGGLE SHOW PRICE
  const handleToggleShowPrice = async () => {
    const newVal = !showPrice;
    setShowPrice(newVal);
    try {
      await fetch("/api/theme-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showPrice: newVal }),
      });
    } catch (err) {
      console.error("Failed to update settings", err);
      setShowPrice(!newVal); // revert
    }
  };

  // CLEAR FILTERS
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategoryFilter("all");
  };

  const hasActiveFilters = searchQuery || selectedCategoryFilter !== "all";

  // Get tag component
  const getTagDisplay = (tag: any) => {
    return (
      <span
        key={tag.id}
        className={`px-2 py-1 bg-gradient-to-r ${tag.color} text-white rounded-full text-xs font-bold`}
      >
        {tag.name}
      </span>
    );
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Themes</h1>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/tags")}
            className="gap-2"
          >
            <Tag size={18} />
            Manage Tags
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/categories")}
            className="gap-2"
          >
            <FolderKanban size={18} />
            Manage Categories
          </Button>
        </div>
      </div>

      {/* THEME SETTINGS BAR */}
      <div className="bg-white border rounded-lg p-4 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Theme Settings</h2>
          <p className="text-sm text-gray-500">Configure global settings for themes on the landing page.</p>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox 
            id="show-price" 
            checked={showPrice} 
            onCheckedChange={handleToggleShowPrice} 
          />
          <Label htmlFor="show-price" className="cursor-pointer">
            Show Theme Prices on Landing Page
          </Label>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-white border rounded-lg p-4 mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search themes by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-64 flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <Select
              value={selectedCategoryFilter}
              onValueChange={setSelectedCategoryFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat: any) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Update & Add Theme Buttons */}
          <Button variant="outline" onClick={openBulkModal} className="gap-2">
            <DollarSign size={18} />
            Bulk Update Price
          </Button>
          <Button onClick={() => setAddModal(true)}>Add Theme</Button>
        </div>

        {/* Selection badge */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
              {selectedIds.length} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds([])}
              className="gap-1 text-gray-600 hover:text-gray-900"
            >
              <X size={14} />
              Clear selection
            </Button>
          </div>
        )}

        {/* Active Filters & Clear Button */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Active filters:</span>
            {searchQuery && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                Search: "{searchQuery}"
              </span>
            )}
            {selectedCategoryFilter !== "all" && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                Category:{" "}
                {
                  categories.find(
                    (c: any) => c.id === Number(selectedCategoryFilter)
                  )?.name
                }
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1 text-gray-600 hover:text-gray-900"
            >
              <X size={14} />
              Clear all
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing {filteredThemes.length} of {themes.length} themes
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 w-10">
                <Checkbox
                  checked={allFilteredSelected}
                  onCheckedChange={toggleSelectAllFiltered}
                  aria-label="Select all filtered themes"
                />
              </th>
              <th className="p-3 text-left text-sm font-semibold">Image</th>
              <th className="p-3 text-left text-sm font-semibold">Name</th>
              <th className="p-3 text-left text-sm font-semibold">Price</th>
              <th className="p-3 text-left text-sm font-semibold">
                Categories
              </th>
              <th className="p-3 text-left text-sm font-semibold">Tags</th>
              <th className="p-3 text-left text-sm font-semibold">Demo URL</th>
              <th className="p-3 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredThemes.length > 0 ? (
              filteredThemes.map((t: any) => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <Checkbox
                      checked={selectedIds.includes(t.id)}
                      onCheckedChange={() => toggleSelectTheme(t.id)}
                      aria-label={`Select ${t.name}`}
                    />
                  </td>
                  <td className="p-3">
                    {t.image ? (
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-400">No image</span>
                      </div>
                    )}
                  </td>

                  <td className="p-3 font-medium">{t.name}</td>
                  <td className="p-3">
                    Rp {Number(t.price).toLocaleString("id-ID")}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {t.categories.map((cat: any) => (
                        <span
                          key={cat.id}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {t.tags.length > 0 ? (
                        t.tags.map((tag: any) => getTagDisplay(tag))
                      ) : (
                        <span className="text-xs text-gray-400">No tags</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <a
                      href={t.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Demo
                    </a>
                  </td>

                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(t)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setDeleteId(t.id);
                          setDeleteModal(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500">
                  {hasActiveFilters
                    ? "No themes found matching your filters"
                    : "No themes available. Click 'Add Theme' to create one."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------------- ADD MODAL ---------------- */}
      <Dialog open={addModal} onOpenChange={setAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Theme</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Theme name"
              value={addData.name}
              onChange={(e) => setAddData({ ...addData, name: e.target.value })}
            />

            <Input
              placeholder="Price"
              type="number"
              value={addData.price}
              onChange={(e) =>
                setAddData({ ...addData, price: e.target.value })
              }
            />

            <Input
              placeholder="Demo URL"
              value={addData.demoUrl}
              onChange={(e) =>
                setAddData({ ...addData, demoUrl: e.target.value })
              }
            />

            {/* Categories Checkboxes */}
            <div className="border rounded p-4">
              <Label className="text-sm font-semibold mb-3 block">
                Select Categories (Choose at least one)
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat: any) => (
                  <div key={cat.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`add-cat-${cat.id}`}
                      checked={addData.categoryIds.includes(cat.id)}
                      onCheckedChange={() => toggleAddCategory(cat.id)}
                    />
                    <label
                      htmlFor={`add-cat-${cat.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {cat.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags Checkboxes */}
            <div className="border rounded p-4">
              <Label className="text-sm font-semibold mb-3 block">
                Select Tags (Optional)
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {tags.map((tag: any) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`add-tag-${tag.id}`}
                      checked={addData.tagIds.includes(tag.id)}
                      onCheckedChange={() => toggleAddTag(tag.id)}
                    />
                    <label
                      htmlFor={`add-tag-${tag.id}`}
                      className="text-sm cursor-pointer flex items-center gap-1"
                    >
                      <span
                        className={`inline-block px-2 py-0.5 bg-gradient-to-r ${tag.color} text-white rounded text-xs font-bold`}
                      >
                        {tag.name}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
              {tags.length === 0 && (
                <p className="text-sm text-gray-500">
                  No tags available.{" "}
                  <button
                    onClick={() => router.push("/admin/tags")}
                    className="text-blue-600 hover:underline"
                  >
                    Create tags first
                  </button>
                </p>
              )}
            </div>

            <Input
              type="file"
              accept="image/*"
              onChange={(e: any) =>
                setAddData({ ...addData, image: e.target.files[0] })
              }
            />

            <Button onClick={createTheme} className="w-full">
              Create Theme
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------------- EDIT MODAL ---------------- */}
      <Dialog open={editModal} onOpenChange={setEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Theme</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Theme name"
              value={editData.name || ""}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
            />

            <Input
              placeholder="Price"
              type="number"
              value={editData.price || ""}
              onChange={(e) =>
                setEditData({ ...editData, price: e.target.value })
              }
            />

            <Input
              placeholder="Demo URL"
              value={editData.demoUrl || ""}
              onChange={(e) =>
                setEditData({ ...editData, demoUrl: e.target.value })
              }
            />

            {/* Categories Checkboxes */}
            <div className="border rounded p-4">
              <Label className="text-sm font-semibold mb-3 block">
                Select Categories (Choose at least one)
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat: any) => (
                  <div key={cat.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-cat-${cat.id}`}
                      checked={editData.categoryIds?.includes(cat.id)}
                      onCheckedChange={() => toggleEditCategory(cat.id)}
                    />
                    <label
                      htmlFor={`edit-cat-${cat.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {cat.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags Checkboxes */}
            <div className="border rounded p-4">
              <Label className="text-sm font-semibold mb-3 block">
                Select Tags (Optional)
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {tags.map((tag: any) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-tag-${tag.id}`}
                      checked={editData.tagIds?.includes(tag.id)}
                      onCheckedChange={() => toggleEditTag(tag.id)}
                    />
                    <label
                      htmlFor={`edit-tag-${tag.id}`}
                      className="text-sm cursor-pointer flex items-center gap-1"
                    >
                      <span
                        className={`inline-block px-2 py-0.5 bg-gradient-to-r ${tag.color} text-white rounded text-xs font-bold`}
                      >
                        {tag.name}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {editData.image && typeof editData.image === "string" && (
              <div className="border rounded p-3">
                <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                <img
                  src={editData.image}
                  alt="Current"
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            )}

            <Input
              type="file"
              accept="image/*"
              onChange={(e: any) =>
                setEditData({ ...editData, image: e.target.files[0] })
              }
            />
            <p className="text-xs text-gray-500">
              Leave empty to keep current image
            </p>

            <Button onClick={updateTheme} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------------- BULK PRICE MODAL ---------------- */}
      <Dialog open={bulkModal} onOpenChange={setBulkModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk Update Price</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* Scope */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Scope</Label>
              <div className="space-y-2">
                <label
                  className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${
                    bulkScope === "selected" ? "border-blue-500 bg-blue-50" : ""
                  } ${selectedIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    name="bulkScope"
                    checked={bulkScope === "selected"}
                    disabled={selectedIds.length === 0}
                    onChange={() => setBulkScope("selected")}
                  />
                  <span className="text-sm">
                    Selected themes ({selectedIds.length})
                  </span>
                </label>
                <label
                  className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${
                    bulkScope === "category" ? "border-blue-500 bg-blue-50" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="bulkScope"
                    checked={bulkScope === "category"}
                    onChange={() => setBulkScope("category")}
                  />
                  <span className="text-sm">By category</span>
                </label>
                {bulkScope === "category" && (
                  <Select
                    value={bulkCategoryId}
                    onValueChange={setBulkCategoryId}
                  >
                    <SelectTrigger className="ml-6">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat: any) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <label
                  className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${
                    bulkScope === "all" ? "border-blue-500 bg-blue-50" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="bulkScope"
                    checked={bulkScope === "all"}
                    onChange={() => setBulkScope("all")}
                  />
                  <span className="text-sm">All themes ({themes.length})</span>
                </label>
              </div>
            </div>

            {/* Mode */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Price adjustment</Label>
              <div className="space-y-2">
                <label
                  className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${
                    bulkMode === "fixed" ? "border-blue-500 bg-blue-50" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="bulkMode"
                    checked={bulkMode === "fixed"}
                    onChange={() => setBulkMode("fixed")}
                  />
                  <span className="text-sm">Set fixed price</span>
                </label>
                <label
                  className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${
                    bulkMode === "percentage"
                      ? "border-blue-500 bg-blue-50"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="bulkMode"
                    checked={bulkMode === "percentage"}
                    onChange={() => setBulkMode("percentage")}
                  />
                  <span className="text-sm">Adjust by percentage</span>
                </label>
                <label
                  className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${
                    bulkMode === "amount" ? "border-blue-500 bg-blue-50" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="bulkMode"
                    checked={bulkMode === "amount"}
                    onChange={() => setBulkMode("amount")}
                  />
                  <span className="text-sm">Adjust by amount</span>
                </label>
              </div>
            </div>

            {/* Direction (for percentage/amount) */}
            {bulkMode !== "fixed" && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Direction</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={
                      bulkDirection === "increase" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setBulkDirection("increase")}
                  >
                    Increase
                  </Button>
                  <Button
                    type="button"
                    variant={
                      bulkDirection === "decrease" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setBulkDirection("decrease")}
                  >
                    Decrease
                  </Button>
                </div>
              </div>
            )}

            {/* Value */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                {bulkMode === "fixed"
                  ? "New price (Rp)"
                  : bulkMode === "percentage"
                    ? "Percentage (%)"
                    : "Amount (Rp)"}
              </Label>
              <Input
                type="number"
                min="0"
                placeholder={
                  bulkMode === "fixed"
                    ? "e.g. 450000"
                    : bulkMode === "percentage"
                      ? "e.g. 10"
                      : "e.g. 50000"
                }
                value={bulkValue}
                onChange={(e) => setBulkValue(e.target.value)}
              />
            </div>

            {/* Preview */}
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
              {bulkPreviewCount > 0 ? (
                <span>
                  <strong>{bulkPreviewCount}</strong> theme
                  {bulkPreviewCount !== 1 ? "s" : ""} will be updated
                </span>
              ) : (
                <span className="text-amber-600">
                  No themes match the selected scope
                </span>
              )}
            </div>

            <Button
              onClick={applyBulkPrice}
              className="w-full"
              disabled={bulkLoading || bulkPreviewCount === 0}
            >
              {bulkLoading ? "Updating..." : "Apply Price Update"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------------- DELETE CONFIRM ---------------- */}
      <Dialog open={deleteModal} onOpenChange={setDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Theme?</DialogTitle>
          </DialogHeader>

          <p className="text-gray-600">This action cannot be undone.</p>

          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Confirm Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
