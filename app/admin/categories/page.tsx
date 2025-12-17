"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Palette, X, Plus, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // ADD
  const [addModal, setAddModal] = useState(false);
  const [addName, setAddName] = useState("");

  // EDIT
  const [editModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  // DELETE
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState("");

  // LOAD DATA
  const loadData = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // FILTERED CATEGORIES
  const filteredCategories = categories.filter((cat: any) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // CREATE CATEGORY
  async function createCategory() {
    if (!addName.trim()) {
      alert("Please enter a category name");
      return;
    }

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: addName.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to create category");
        return;
      }

      setAddModal(false);
      setAddName("");
      await loadData();
    } catch (error) {
      console.error("Create error:", error);
      alert("Failed to create category");
    }
  }

  // OPEN EDIT MODAL
  function openEditModal(cat: any) {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditModal(true);
  }

  // UPDATE CATEGORY
  async function updateCategory() {
    if (!editName.trim()) {
      alert("Please enter a category name");
      return;
    }

    if (!editId) return;

    try {
      const res = await fetch(`/api/categories/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update category");
        return;
      }

      setEditModal(false);
      await loadData();
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update category");
    }
  }

  // OPEN DELETE MODAL
  function openDeleteModal(cat: any) {
    setDeleteId(cat.id);
    setDeleteError("");
    setDeleteModal(true);
  }

  // DELETE CATEGORY
  async function deleteCategory() {
    try {
      const res = await fetch(`/api/categories/${deleteId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setDeleteError(
          data.error ||
            "Cannot delete category. It may be associated with themes."
        );
        return;
      }

      setDeleteModal(false);
      await loadData();
    } catch (error) {
      console.error("Delete error:", error);
      setDeleteError("Failed to delete category");
    }
  }

  // CLEAR SEARCH
  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage theme categories for your wedding invitation templates
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
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Add Button */}
          <Button onClick={() => setAddModal(true)} className="gap-2">
            <Plus size={18} />
            Add Category
          </Button>
        </div>

        {/* Results Count */}
        {searchQuery && (
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredCategories.length} of {categories.length}{" "}
            categories
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left text-sm font-semibold w-20">No.</th>
              <th className="p-3 text-left text-sm font-semibold">
                Category Name
              </th>
              <th className="p-3 text-left text-sm font-semibold w-48">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat: any, index: number) => (
                <tr key={cat.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-gray-600">{index + 1}</td>
                  <td className="p-3 font-medium">{cat.name}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(cat)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteModal(cat)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  {searchQuery
                    ? "No categories found matching your search"
                    : "No categories available. Click 'Add Category' to create one."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      {categories.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Total categories: {categories.length}
        </div>
      )}

      {/* ---------------- ADD MODAL ---------------- */}
      <Dialog open={addModal} onOpenChange={setAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Category Name
              </label>
              <Input
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                placeholder="e.g., Premium, Luxury, Floral"
                onKeyDown={(e) => {
                  if (e.key === "Enter") createCategory();
                }}
                autoFocus
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setAddModal(false);
                  setAddName("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={createCategory} className="flex-1">
                Create Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------------- EDIT MODAL ---------------- */}
      <Dialog open={editModal} onOpenChange={setEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Category Name
              </label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Category name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") updateCategory();
                }}
                autoFocus
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setEditModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={updateCategory} className="flex-1">
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
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {deleteError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{deleteError}</AlertDescription>
              </Alert>
            ) : (
              <p className="text-gray-600">
                Are you sure you want to delete this category? This action
                cannot be undone.
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
                  onClick={deleteCategory}
                  className="flex-1"
                >
                  Delete Category
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
