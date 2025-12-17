"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  X,
  Plus,
  Palette,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Star,
  Zap,
  Heart,
  Crown,
  Award,
  Flame,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Icon mapping
const iconOptions = [
  { value: "Sparkles", label: "Sparkles", Icon: Sparkles },
  { value: "TrendingUp", label: "Trending Up", Icon: TrendingUp },
  { value: "Star", label: "Star", Icon: Star },
  { value: "Zap", label: "Zap", Icon: Zap },
  { value: "Heart", label: "Heart", Icon: Heart },
  { value: "Crown", label: "Crown", Icon: Crown },
  { value: "Award", label: "Award", Icon: Award },
  { value: "Flame", label: "Flame", Icon: Flame },
];

// Color presets
const colorOptions = [
  {
    value: "from-emerald-500 to-teal-500",
    label: "Green",
    preview: "bg-gradient-to-r from-emerald-500 to-teal-500",
  },
  {
    value: "from-amber-500 to-yellow-500",
    label: "Gold",
    preview: "bg-gradient-to-r from-amber-500 to-yellow-500",
  },
  {
    value: "from-red-500 to-pink-500",
    label: "Red",
    preview: "bg-gradient-to-r from-red-500 to-pink-500",
  },
  {
    value: "from-blue-500 to-cyan-500",
    label: "Blue",
    preview: "bg-gradient-to-r from-blue-500 to-cyan-500",
  },
  {
    value: "from-purple-500 to-pink-500",
    label: "Purple",
    preview: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    value: "from-orange-500 to-red-500",
    label: "Orange",
    preview: "bg-gradient-to-r from-orange-500 to-red-500",
  },
];

export default function TagsPage() {
  const router = useRouter();
  const [tags, setTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // ADD
  const [addModal, setAddModal] = useState(false);
  const [addData, setAddData] = useState({
    name: "",
    color: "",
    icon: "",
  });

  // EDIT
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState<any>({});

  // DELETE
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState("");

  // LOAD DATA
  const loadData = useCallback(async () => {
    try {
      const res = await fetch("/api/tags");
      const data = await res.json();
      setTags(data || []);
    } catch (error) {
      console.error("Failed to load tags:", error);
      setTags([]);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // FILTERED TAGS
  const filteredTags = tags.filter((tag: any) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // CREATE TAG
  async function createTag() {
    if (!addData.name.trim() || !addData.color || !addData.icon) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to create tag");
        return;
      }

      setAddModal(false);
      setAddData({ name: "", color: "", icon: "" });
      await loadData();
    } catch (error) {
      console.error("Create error:", error);
      alert("Failed to create tag");
    }
  }

  // OPEN EDIT MODAL
  function openEditModal(tag: any) {
    setEditData(tag);
    setEditModal(true);
  }

  // UPDATE TAG
  async function updateTag() {
    if (!editData.name.trim() || !editData.color || !editData.icon) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(`/api/tags/${editData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editData.name,
          color: editData.color,
          icon: editData.icon,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update tag");
        return;
      }

      setEditModal(false);
      await loadData();
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update tag");
    }
  }

  // OPEN DELETE MODAL
  function openDeleteModal(tag: any) {
    setDeleteId(tag.id);
    setDeleteError("");
    setDeleteModal(true);
  }

  // DELETE TAG
  async function deleteTag() {
    try {
      const res = await fetch(`/api/tags/${deleteId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setDeleteError(
          data.error || "Cannot delete tag. It may be associated with themes."
        );
        return;
      }

      setDeleteModal(false);
      await loadData();
    } catch (error) {
      console.error("Delete error:", error);
      setDeleteError("Failed to delete tag");
    }
  }

  // Get Icon Component
  const getIconComponent = (iconName: string) => {
    const icon = iconOptions.find((opt) => opt.value === iconName);
    return icon ? icon.Icon : Sparkles;
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tags</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage theme tags like "New", "Best Seller", etc.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => router.push("/admin/themes")}
          className="gap-2"
        >
          <Palette size={18} />
          Manage Themes
        </Button>
      </div>

      {/* SEARCH & ADD BAR */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <Button onClick={() => setAddModal(true)} className="gap-2">
            <Plus size={18} />
            Add Tag
          </Button>
        </div>

        {searchQuery && (
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredTags.length} of {tags.length} tags
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left text-sm font-semibold w-20">No.</th>
              <th className="p-3 text-left text-sm font-semibold">Tag Name</th>
              <th className="p-3 text-left text-sm font-semibold">Preview</th>
              <th className="p-3 text-left text-sm font-semibold w-48">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredTags.length > 0 ? (
              filteredTags.map((tag: any, index: number) => {
                const IconComponent = getIconComponent(tag.icon);
                return (
                  <tr key={tag.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-600">{index + 1}</td>
                    <td className="p-3 font-medium">{tag.name}</td>
                    <td className="p-3">
                      <div
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r ${tag.color} text-white text-xs font-bold shadow-lg`}
                      >
                        <IconComponent size={12} />
                        {tag.name}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(tag)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteModal(tag)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  {searchQuery
                    ? "No tags found matching your search"
                    : "No tags available. Click 'Add Tag' to create one."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {tags.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Total tags: {tags.length}
        </div>
      )}

      {/* ---------------- ADD MODAL ---------------- */}
      <Dialog open={addModal} onOpenChange={setAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tag</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Tag Name</Label>
              <Input
                value={addData.name}
                onChange={(e) =>
                  setAddData({ ...addData, name: e.target.value })
                }
                placeholder="e.g., New, Best Seller, Hot"
                autoFocus
              />
            </div>

            <div>
              <Label className="mb-2 block">Icon</Label>
              <Select
                value={addData.icon}
                onValueChange={(value) =>
                  setAddData({ ...addData, icon: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <opt.Icon size={16} />
                        {opt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Color</Label>
              <div className="grid grid-cols-3 gap-3">
                {colorOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setAddData({ ...addData, color: opt.value })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      addData.color === opt.value
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`h-8 rounded ${opt.preview}`} />
                    <p className="text-xs mt-2 font-medium">{opt.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {addData.name && addData.icon && addData.color && (
              <div>
                <Label className="mb-2 block">Preview</Label>
                <div
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r ${addData.color} text-white text-xs font-bold shadow-lg`}
                >
                  {React.createElement(getIconComponent(addData.icon), {
                    size: 12,
                  })}
                  {addData.name}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setAddModal(false);
                  setAddData({ name: "", color: "", icon: "" });
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={createTag} className="flex-1">
                Create Tag
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------------- EDIT MODAL ---------------- */}
      <Dialog open={editModal} onOpenChange={setEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Tag Name</Label>
              <Input
                value={editData.name || ""}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                placeholder="Tag name"
                autoFocus
              />
            </div>

            <div>
              <Label className="mb-2 block">Icon</Label>
              <Select
                value={editData.icon}
                onValueChange={(value) =>
                  setEditData({ ...editData, icon: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <opt.Icon size={16} />
                        {opt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Color</Label>
              <div className="grid grid-cols-3 gap-3">
                {colorOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      setEditData({ ...editData, color: opt.value })
                    }
                    className={`p-3 rounded-lg border-2 transition-all ${
                      editData.color === opt.value
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`h-8 rounded ${opt.preview}`} />
                    <p className="text-xs mt-2 font-medium">{opt.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {editData.name && editData.icon && editData.color && (
              <div>
                <Label className="mb-2 block">Preview</Label>
                <div
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r ${editData.color} text-white text-xs font-bold shadow-lg`}
                >
                  {React.createElement(getIconComponent(editData.icon), {
                    size: 12,
                  })}
                  {editData.name}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setEditModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={updateTag} className="flex-1">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------------- DELETE MODAL ---------------- */}
      <Dialog open={deleteModal} onOpenChange={setDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tag</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {deleteError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{deleteError}</AlertDescription>
              </Alert>
            ) : (
              <p className="text-gray-600">
                Are you sure you want to delete this tag? This action cannot be
                undone.
              </p>
            )}

            {deleteError ? (
              <Button
                variant="outline"
                onClick={() => setDeleteModal(false)}
                className="w-full"
              >
                Close
              </Button>
            ) : (
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setDeleteModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={deleteTag}
                  className="flex-1"
                >
                  Delete Tag
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
