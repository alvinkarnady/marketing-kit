"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  MessageSquare,
  CheckCircle,
  XCircle,
  Star,
  Settings,
  Eye,
  EyeOff,
  Award,
  ArrowUp,
  Home,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState([]);
  const [themes, setThemes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Settings
  const [settingsModal, setSettingsModal] = useState(false);
  const [settings, setSettings] = useState({
    maxDisplay: 6,
    autoApprove: false,
    requireApproval: true,
  });

  // ADD
  const [addModal, setAddModal] = useState(false);
  const [addData, setAddData] = useState({
    name: "",
    role: "Pasangan Pengantin",
    email: "",
    rating: 5,
    text: "",
    event: "",
    weddingDate: "",
    themeId: "",
    isActive: true,
    isApproved: true,
    isFeatured: false,
    priority: 0,
    image: null as File | null,
  });

  // EDIT
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState<any>({});

  // DELETE
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // LOAD DATA
  const loadData = useCallback(async () => {
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      setTestimonials(data || []);

      const resThemes = await fetch("/api/themes");
      const themesData = await resThemes.json();
      setThemes(themesData.data || []);

      const resSettings = await fetch("/api/testimonials/settings");
      const settingsData = await resSettings.json();
      setSettings(settingsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // FILTERED TESTIMONIALS
  const filteredTestimonials = testimonials.filter((t: any) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.text.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "approved" && t.isApproved) ||
      (filterStatus === "pending" && !t.isApproved) ||
      (filterStatus === "active" && t.isActive) ||
      (filterStatus === "featured" && t.isFeatured);

    return matchesSearch && matchesStatus;
  });

  // CREATE TESTIMONIAL
  const createTestimonial = async () => {
    if (!addData.name || !addData.text || !addData.event) {
      alert("Please fill required fields");
      return;
    }

    const fd = new FormData();
    fd.append("name", addData.name);
    fd.append("role", addData.role);
    fd.append("email", addData.email);
    fd.append("rating", String(addData.rating));
    fd.append("text", addData.text);
    fd.append("event", addData.event);
    fd.append("weddingDate", addData.weddingDate);
    fd.append("themeId", addData.themeId);
    fd.append("isActive", String(addData.isActive));
    fd.append("isApproved", String(addData.isApproved));
    fd.append("isFeatured", String(addData.isFeatured));
    fd.append("priority", String(addData.priority));
    fd.append("isAdminCreate", "true");

    if (addData.image) fd.append("image", addData.image);

    await fetch("/api/testimonials", {
      method: "POST",
      body: fd,
    });

    setAddModal(false);
    setAddData({
      name: "",
      role: "Pasangan Pengantin",
      email: "",
      rating: 5,
      text: "",
      event: "",
      weddingDate: "",
      themeId: "",
      isActive: true,
      isApproved: true,
      isFeatured: false,
      priority: 0,
      image: null,
    });
    loadData();
  };

  // OPEN EDIT
  const openEdit = (t: any) => {
    setEditData({
      ...t,
      rating: String(t.rating),
      priority: String(t.priority),
      themeId: t.themeId ? String(t.themeId) : "",
      weddingDate: t.weddingDate ? t.weddingDate.split("T")[0] : "",
      image: t.image,
    });
    setEditModal(true);
  };

  // UPDATE TESTIMONIAL
  const updateTestimonial = async () => {
    if (!editData.name || !editData.text || !editData.event) {
      alert("Please fill required fields");
      return;
    }

    const fd = new FormData();
    fd.append("name", editData.name);
    fd.append("role", editData.role);
    fd.append("email", editData.email || "");
    fd.append("rating", String(editData.rating));
    fd.append("text", editData.text);
    fd.append("event", editData.event);
    fd.append("weddingDate", editData.weddingDate || "");
    fd.append("themeId", editData.themeId || "");
    fd.append("isActive", String(editData.isActive));
    fd.append("isApproved", String(editData.isApproved));
    fd.append("isFeatured", String(editData.isFeatured));
    fd.append("priority", String(editData.priority));

    if (editData.image instanceof File) {
      fd.append("image", editData.image);
    }

    await fetch(`/api/testimonials/${editData.id}`, {
      method: "PUT",
      body: fd,
    });

    setEditModal(false);
    loadData();
  };

  // QUICK APPROVE
  const quickApprove = async (id: number, currentStatus: boolean) => {
    const fd = new FormData();
    const testimonial = testimonials.find((t: any) => t.id === id);
    if (!testimonial) return;

    fd.append("name", testimonial.name);
    fd.append("role", testimonial.role);
    fd.append("email", testimonial.email || "");
    fd.append("rating", String(testimonial.rating));
    fd.append("text", testimonial.text);
    fd.append("event", testimonial.event);
    fd.append("weddingDate", testimonial.weddingDate || "");
    fd.append(
      "themeId",
      testimonial.themeId ? String(testimonial.themeId) : ""
    );
    fd.append("isActive", String(testimonial.isActive));
    fd.append("isApproved", String(!currentStatus));
    fd.append("isFeatured", String(testimonial.isFeatured));
    fd.append("priority", String(testimonial.priority));

    await fetch(`/api/testimonials/${id}`, {
      method: "PUT",
      body: fd,
    });

    loadData();
  };

  // QUICK TOGGLE ACTIVE
  const toggleActive = async (id: number, currentStatus: boolean) => {
    const fd = new FormData();
    const testimonial = testimonials.find((t: any) => t.id === id);
    if (!testimonial) return;

    fd.append("name", testimonial.name);
    fd.append("role", testimonial.role);
    fd.append("email", testimonial.email || "");
    fd.append("rating", String(testimonial.rating));
    fd.append("text", testimonial.text);
    fd.append("event", testimonial.event);
    fd.append("weddingDate", testimonial.weddingDate || "");
    fd.append(
      "themeId",
      testimonial.themeId ? String(testimonial.themeId) : ""
    );
    fd.append("isActive", String(!currentStatus));
    fd.append("isApproved", String(testimonial.isApproved));
    fd.append("isFeatured", String(testimonial.isFeatured));
    fd.append("priority", String(testimonial.priority));

    await fetch(`/api/testimonials/${id}`, {
      method: "PUT",
      body: fd,
    });

    loadData();
  };

  // DELETE
  const confirmDelete = async () => {
    await fetch(`/api/testimonials/${deleteId}`, {
      method: "DELETE",
    });

    setDeleteModal(false);
    loadData();
  };

  // UPDATE SETTINGS
  const updateSettings = async () => {
    await fetch("/api/testimonials/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    setSettingsModal(false);
    loadData();
  };

  // Stats
  const stats = {
    total: testimonials.length,
    approved: testimonials.filter((t: any) => t.isApproved).length,
    pending: testimonials.filter((t: any) => !t.isApproved).length,
    featured: testimonials.filter((t: any) => t.isFeatured).length,
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage client testimonials and reviews
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setSettingsModal(true)}
            className="gap-2"
          >
            <Settings size={18} />
            Settings
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="gap-2"
          >
            <Home size={18} />
            View Site
          </Button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Total</span>
          </div>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Approved</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-gray-600">Featured</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">{stats.featured}</p>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="bg-white border rounded-lg p-4 mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search by name or text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => setAddModal(true)} className="gap-2">
            <Plus size={18} />
            Add Testimonial
          </Button>
        </div>

        {(searchQuery || filterStatus !== "all") && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">
              Showing {filteredTestimonials.length} of {testimonials.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setFilterStatus("all");
              }}
              className="gap-1"
            >
              <X size={14} />
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left text-sm font-semibold">Client</th>
              <th className="p-3 text-left text-sm font-semibold">Theme</th>
              <th className="p-3 text-left text-sm font-semibold">Rating</th>
              <th className="p-3 text-left text-sm font-semibold">
                Testimonial
              </th>
              <th className="p-3 text-left text-sm font-semibold">Status</th>
              <th className="p-3 text-left text-sm font-semibold">Priority</th>
              <th className="p-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTestimonials.length > 0 ? (
              filteredTestimonials.map((t: any) => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {t.image ? (
                        <img
                          src={t.image}
                          alt={t.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
                          <span className="text-lg font-bold text-amber-700">
                            {t.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{t.name}</p>
                        <p className="text-xs text-gray-500">{t.event}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    {t.theme ? (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {t.theme.name}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">No theme</span>
                    )}
                  </td>

                  <td className="p-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < t.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </td>

                  <td className="p-3 max-w-xs">
                    <p className="text-sm line-clamp-2 text-gray-600">
                      {t.text}
                    </p>
                  </td>

                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      {t.isApproved ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs w-fit">
                          <CheckCircle size={12} />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs w-fit">
                          <XCircle size={12} />
                          Pending
                        </span>
                      )}
                      {t.isFeatured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs w-fit">
                          <Award size={12} />
                          Featured
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <ArrowUp size={14} className="text-gray-400" />
                      <span className="font-medium">{t.priority}</span>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => quickApprove(t.id, t.isApproved)}
                          title={t.isApproved ? "Unapprove" : "Approve"}
                        >
                          {t.isApproved ? (
                            <XCircle size={14} />
                          ) : (
                            <CheckCircle size={14} />
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActive(t.id, t.isActive)}
                          title={t.isActive ? "Hide" : "Show"}
                        >
                          {t.isActive ? (
                            <Eye size={14} />
                          ) : (
                            <EyeOff size={14} />
                          )}
                        </Button>
                      </div>

                      <div className="flex gap-1">
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
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No testimonials found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------------- ADD MODAL ---------------- */}
      <Dialog open={addModal} onOpenChange={setAddModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Testimonial</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">
                  Client Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g., Andi & Siti"
                  value={addData.name}
                  onChange={(e) =>
                    setAddData({ ...addData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <Label className="mb-2 block">Role</Label>
                <Input
                  placeholder="Pasangan Pengantin"
                  value={addData.role}
                  onChange={(e) =>
                    setAddData({ ...addData, role: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Email (Optional)</Label>
                <Input
                  type="email"
                  placeholder="client@example.com"
                  value={addData.email}
                  onChange={(e) =>
                    setAddData({ ...addData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <Label className="mb-2 block">Rating</Label>
                <Select
                  value={String(addData.rating)}
                  onValueChange={(val) =>
                    setAddData({ ...addData, rating: Number(val) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((r) => (
                      <SelectItem key={r} value={String(r)}>
                        {r} Star{r > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">
                Testimonial Text <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Write the testimonial..."
                value={addData.text}
                onChange={(e) =>
                  setAddData({ ...addData, text: e.target.value })
                }
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">
                  Event <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g., Pernikahan, Januari 2024"
                  value={addData.event}
                  onChange={(e) =>
                    setAddData({ ...addData, event: e.target.value })
                  }
                />
              </div>

              <div>
                <Label className="mb-2 block">Wedding Date (Optional)</Label>
                <Input
                  type="date"
                  value={addData.weddingDate}
                  onChange={(e) =>
                    setAddData({ ...addData, weddingDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Theme Used (Optional)</Label>
              <Select
                value={addData.themeId || "none"}
                onValueChange={(val) =>
                  setAddData({ ...addData, themeId: val === "none" ? "" : val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No theme</SelectItem>
                  {themes.map((theme: any) => (
                    <SelectItem key={theme.id} value={String(theme.id)}>
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">
                Client Photo (Optional - Will use initial if empty)
              </Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e: any) =>
                  setAddData({ ...addData, image: e.target.files[0] })
                }
              />
            </div>

            <div className="border-t pt-4">
              <Label className="mb-3 block font-semibold">
                Display Settings
              </Label>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="add-active"
                    checked={addData.isActive}
                    onCheckedChange={(checked) =>
                      setAddData({ ...addData, isActive: !!checked })
                    }
                  />
                  <label
                    htmlFor="add-active"
                    className="text-sm cursor-pointer"
                  >
                    Active (Show on site)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="add-approved"
                    checked={addData.isApproved}
                    onCheckedChange={(checked) =>
                      setAddData({ ...addData, isApproved: !!checked })
                    }
                  />
                  <label
                    htmlFor="add-approved"
                    className="text-sm cursor-pointer"
                  >
                    Approved
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="add-featured"
                    checked={addData.isFeatured}
                    onCheckedChange={(checked) =>
                      setAddData({ ...addData, isFeatured: !!checked })
                    }
                  />
                  <label
                    htmlFor="add-featured"
                    className="text-sm cursor-pointer"
                  >
                    Featured (Priority display)
                  </label>
                </div>

                <div>
                  <Label className="mb-2 block text-xs">Priority Order</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={addData.priority}
                    onChange={(e) =>
                      setAddData({
                        ...addData,
                        priority: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setAddModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={createTestimonial} className="flex-1">
                Create Testimonial
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------------- EDIT MODAL ---------------- */}
      <Dialog open={editModal} onOpenChange={setEditModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">
                  Client Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g., Andi & Siti"
                  value={editData.name || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <Label className="mb-2 block">Role</Label>
                <Input
                  placeholder="Pasangan Pengantin"
                  value={editData.role || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, role: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Email (Optional)</Label>
                <Input
                  type="email"
                  placeholder="client@example.com"
                  value={editData.email || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <Label className="mb-2 block">Rating</Label>
                <Select
                  value={String(editData.rating)}
                  onValueChange={(val) =>
                    setEditData({ ...editData, rating: Number(val) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((r) => (
                      <SelectItem key={r} value={String(r)}>
                        {r} Star{r > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">
                Testimonial Text <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Write the testimonial..."
                value={editData.text || ""}
                onChange={(e) =>
                  setEditData({ ...editData, text: e.target.value })
                }
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">
                  Event <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g., Pernikahan, Januari 2024"
                  value={editData.event || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, event: e.target.value })
                  }
                />
              </div>

              <div>
                <Label className="mb-2 block">Wedding Date (Optional)</Label>
                <Input
                  type="date"
                  value={editData.weddingDate || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, weddingDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Theme Used (Optional)</Label>
              <Select
                value={editData.themeId || "none"}
                onValueChange={(val) =>
                  setEditData({
                    ...editData,
                    themeId: val === "none" ? "" : val,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No theme</SelectItem>
                  {themes.map((theme: any) => (
                    <SelectItem key={theme.id} value={String(theme.id)}>
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {editData.image && typeof editData.image === "string" && (
              <div className="border rounded p-3">
                <p className="text-sm text-gray-600 mb-2">Current Photo:</p>
                <img
                  src={editData.image}
                  alt="Current"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}

            <div>
              <Label className="mb-2 block">
                Update Photo (Optional - Leave empty to keep current)
              </Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e: any) =>
                  setEditData({ ...editData, image: e.target.files[0] })
                }
              />
            </div>

            <div className="border-t pt-4">
              <Label className="mb-3 block font-semibold">
                Display Settings
              </Label>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-active"
                    checked={editData.isActive}
                    onCheckedChange={(checked) =>
                      setEditData({ ...editData, isActive: !!checked })
                    }
                  />
                  <label
                    htmlFor="edit-active"
                    className="text-sm cursor-pointer"
                  >
                    Active (Show on site)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-approved"
                    checked={editData.isApproved}
                    onCheckedChange={(checked) =>
                      setEditData({ ...editData, isApproved: !!checked })
                    }
                  />
                  <label
                    htmlFor="edit-approved"
                    className="text-sm cursor-pointer"
                  >
                    Approved
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-featured"
                    checked={editData.isFeatured}
                    onCheckedChange={(checked) =>
                      setEditData({ ...editData, isFeatured: !!checked })
                    }
                  />
                  <label
                    htmlFor="edit-featured"
                    className="text-sm cursor-pointer"
                  >
                    Featured (Priority display)
                  </label>
                </div>

                <div>
                  <Label className="mb-2 block text-xs">Priority Order</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={editData.priority || 0}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        priority: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setEditModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={updateTestimonial} className="flex-1">
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
            <DialogTitle>Delete Testimonial?</DialogTitle>
          </DialogHeader>

          <p className="text-gray-600">
            This action cannot be undone. The testimonial will be permanently
            removed.
          </p>

          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="flex-1"
            >
              Delete Testimonial
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------------- SETTINGS MODAL ---------------- */}
      <Dialog open={settingsModal} onOpenChange={setSettingsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Testimonial Display Settings</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                Control how testimonials are displayed on your website
              </AlertDescription>
            </Alert>

            <div>
              <Label className="mb-2 block">
                Maximum Testimonials to Display
              </Label>
              <Input
                type="number"
                min="1"
                max="20"
                value={settings.maxDisplay}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maxDisplay: Number(e.target.value),
                  })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Number of testimonials to show on homepage (1-20)
              </p>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center space-x-2 mb-3">
                <Checkbox
                  id="auto-approve"
                  checked={settings.autoApprove}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoApprove: !!checked })
                  }
                />
                <label
                  htmlFor="auto-approve"
                  className="text-sm cursor-pointer"
                >
                  Auto-approve new submissions
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="require-approval"
                  checked={settings.requireApproval}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, requireApproval: !!checked })
                  }
                />
                <label
                  htmlFor="require-approval"
                  className="text-sm cursor-pointer"
                >
                  Require admin approval for submissions
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setSettingsModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={updateSettings} className="flex-1">
                Save Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
