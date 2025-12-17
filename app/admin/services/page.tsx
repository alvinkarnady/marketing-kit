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
  Settings,
  Eye,
  EyeOff,
  ArrowUp,
  Home,
  Sparkles,
  Star,
  Award,
  Crown,
  Heart,
  Zap,
  Flower2,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Icon mapping
const iconOptions = [
  { name: "Star", icon: Star },
  { name: "Crown", icon: Crown },
  { name: "Sparkles", icon: Sparkles },
  { name: "Zap", icon: Zap },
  { name: "Award", icon: Award },
  { name: "Heart", icon: Heart },
  { name: "Flower2", icon: Flower2 },
];

// Color gradient presets
const colorPresets = [
  { name: "Gold", value: "from-amber-400 to-yellow-500" },
  { name: "Purple", value: "from-indigo-400 to-purple-500" },
  { name: "Pink", value: "from-pink-400 to-rose-500" },
  { name: "Blue", value: "from-blue-400 to-cyan-500" },
  { name: "Green", value: "from-green-400 to-emerald-500" },
  { name: "Red", value: "from-red-400 to-orange-500" },
  { name: "Gray", value: "from-gray-400 to-gray-500" },
];

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Settings
  const [settingsModal, setSettingsModal] = useState(false);
  const [settings, setSettings] = useState({
    maxDisplay: 3,
    enableFlipAnimation: true,
    autoRotate: false,
    autoRotateInterval: 5000,
  });

  // ADD
  const [addModal, setAddModal] = useState(false);
  const [addData, setAddData] = useState({
    title: "",
    description: "",
    icon: "Star",
    color: "from-amber-400 to-yellow-500",
    features: ["", "", ""],
    buttonText: "Lihat Tema Ini",
    buttonLink: "",
    isActive: true,
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
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data || []);

      const resSettings = await fetch("/api/services/settings");
      const settingsData = await resSettings.json();
      setSettings(settingsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // FILTERED SERVICES
  const filteredServices = services.filter((s: any) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && s.isActive) ||
      (filterStatus === "featured" && s.isFeatured);

    return matchesSearch && matchesStatus;
  });

  // CREATE SERVICE
  const createService = async () => {
    if (!addData.title || !addData.description) {
      alert("Please fill required fields");
      return;
    }

    const fd = new FormData();
    fd.append("title", addData.title);
    fd.append("description", addData.description);
    fd.append("icon", addData.icon);
    fd.append("color", addData.color);
    fd.append(
      "features",
      JSON.stringify(addData.features.filter((f) => f.trim()))
    );
    fd.append("buttonText", addData.buttonText);
    fd.append("buttonLink", addData.buttonLink);
    fd.append("isActive", String(addData.isActive));
    fd.append("isFeatured", String(addData.isFeatured));
    fd.append("priority", String(addData.priority));

    if (addData.image) fd.append("image", addData.image);

    await fetch("/api/services", {
      method: "POST",
      body: fd,
    });

    setAddModal(false);
    setAddData({
      title: "",
      description: "",
      icon: "Star",
      color: "from-amber-400 to-yellow-500",
      features: ["", "", ""],
      buttonText: "Lihat Tema Ini",
      buttonLink: "",
      isActive: true,
      isFeatured: false,
      priority: 0,
      image: null,
    });
    loadData();
  };

  // OPEN EDIT
  const openEdit = (s: any) => {
    setEditData({
      ...s,
      features: s.features || ["", "", ""],
      priority: String(s.priority),
    });
    setEditModal(true);
  };

  // UPDATE SERVICE
  const updateService = async () => {
    if (!editData.title || !editData.description) {
      alert("Please fill required fields");
      return;
    }

    const fd = new FormData();
    fd.append("title", editData.title);
    fd.append("description", editData.description);
    fd.append("icon", editData.icon);
    fd.append("color", editData.color);
    fd.append(
      "features",
      JSON.stringify(editData.features.filter((f: string) => f.trim()))
    );
    fd.append("buttonText", editData.buttonText);
    fd.append("buttonLink", editData.buttonLink || "");
    fd.append("isActive", String(editData.isActive));
    fd.append("isFeatured", String(editData.isFeatured));
    fd.append("priority", String(editData.priority));

    if (editData.image instanceof File) {
      fd.append("image", editData.image);
    } else {
      fd.append("keepExistingImage", "true");
    }

    await fetch(`/api/services/${editData.id}`, {
      method: "PUT",
      body: fd,
    });

    setEditModal(false);
    loadData();
  };

  // QUICK TOGGLE ACTIVE
  const toggleActive = async (id: number, currentStatus: boolean) => {
    const service = services.find((s: any) => s.id === id);
    if (!service) return;

    const fd = new FormData();
    fd.append("title", service.title);
    fd.append("description", service.description);
    fd.append("icon", service.icon);
    fd.append("color", service.color);
    fd.append("features", JSON.stringify(service.features));
    fd.append("buttonText", service.buttonText);
    fd.append("buttonLink", service.buttonLink || "");
    fd.append("isActive", String(!currentStatus));
    fd.append("isFeatured", String(service.isFeatured));
    fd.append("priority", String(service.priority));
    fd.append("keepExistingImage", "true");

    await fetch(`/api/services/${id}`, {
      method: "PUT",
      body: fd,
    });

    loadData();
  };

  // DELETE
  const confirmDelete = async () => {
    await fetch(`/api/services/${deleteId}`, {
      method: "DELETE",
    });

    setDeleteModal(false);
    loadData();
  };

  // UPDATE SETTINGS
  const updateSettings = async () => {
    await fetch("/api/services/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    setSettingsModal(false);
    loadData();
  };

  // Stats
  const stats = {
    total: services.length,
    active: services.filter((s: any) => s.isActive).length,
    featured: services.filter((s: any) => s.isFeatured).length,
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage service cards and theme offerings
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
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Total</span>
          </div>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Active</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-amber-600" />
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
              placeholder="Search by title or description..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => setAddModal(true)} className="gap-2">
            <Plus size={18} />
            Add Service
          </Button>
        </div>

        {(searchQuery || filterStatus !== "all") && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">
              Showing {filteredServices.length} of {services.length}
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
              <th className="p-3 text-left text-sm font-semibold">Service</th>
              <th className="p-3 text-left text-sm font-semibold">
                Icon & Color
              </th>
              <th className="p-3 text-left text-sm font-semibold">Features</th>
              <th className="p-3 text-left text-sm font-semibold">Status</th>
              <th className="p-3 text-left text-sm font-semibold">Priority</th>
              <th className="p-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredServices.length > 0 ? (
              filteredServices.map((s: any) => {
                const IconComponent =
                  iconOptions.find((i) => i.name === s.icon)?.icon || Star;

                return (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {s.image ? (
                          <img
                            src={s.image}
                            alt={s.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{s.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {s.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center`}
                        >
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs text-gray-500">{s.icon}</span>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="space-y-1">
                        {s.features.slice(0, 3).map((f: string, i: number) => (
                          <p key={i} className="text-xs text-gray-600">
                            • {f}
                          </p>
                        ))}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="flex flex-col gap-1">
                        {s.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs w-fit">
                            <Eye size={12} />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs w-fit">
                            <EyeOff size={12} />
                            Inactive
                          </span>
                        )}
                        {s.isFeatured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs w-fit">
                            <Star size={12} />
                            Featured
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <ArrowUp size={14} className="text-gray-400" />
                        <span className="font-medium">{s.priority}</span>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActive(s.id, s.isActive)}
                          title={s.isActive ? "Hide" : "Show"}
                        >
                          {s.isActive ? (
                            <EyeOff size={14} />
                          ) : (
                            <Eye size={14} />
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEdit(s)}
                        >
                          Edit
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setDeleteId(s.id);
                            setDeleteModal(true);
                          }}
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
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No services found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD MODAL - Continued in next artifact */}
      {/* ---------------- ADD MODAL ---------------- */}
      <Dialog open={addModal} onOpenChange={setAddModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g., Classic Elegance"
                value={addData.title}
                onChange={(e) =>
                  setAddData({ ...addData, title: e.target.value })
                }
              />
            </div>

            <div>
              <Label className="mb-2 block">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Describe this service..."
                value={addData.description}
                onChange={(e) =>
                  setAddData({ ...addData, description: e.target.value })
                }
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Icon</Label>
                <Select
                  value={addData.icon}
                  onValueChange={(val) => setAddData({ ...addData, icon: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <SelectItem key={opt.name} value={opt.name}>
                          <div className="flex items-center gap-2">
                            <Icon size={16} />
                            {opt.name}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">Color Gradient</Label>
                <Select
                  value={addData.color}
                  onValueChange={(val) =>
                    setAddData({ ...addData, color: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorPresets.map((preset) => (
                      <SelectItem key={preset.value} value={preset.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded bg-gradient-to-r ${preset.value}`}
                          />
                          {preset.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Features (up to 5)</Label>
              <div className="space-y-2">
                {addData.features.map((feat, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Feature ${index + 1}`}
                      value={feat}
                      onChange={(e) => {
                        const newFeatures = [...addData.features];
                        newFeatures[index] = e.target.value;
                        setAddData({ ...addData, features: newFeatures });
                      }}
                    />
                    {index >= 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newFeatures = addData.features.filter(
                            (_, i) => i !== index
                          );
                          setAddData({ ...addData, features: newFeatures });
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                ))}
                {addData.features.length < 5 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAddData({
                        ...addData,
                        features: [...addData.features, ""],
                      });
                    }}
                  >
                    <Plus size={16} className="mr-1" />
                    Add Feature
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Button Text</Label>
                <Input
                  placeholder="Lihat Tema Ini"
                  value={addData.buttonText}
                  onChange={(e) =>
                    setAddData({ ...addData, buttonText: e.target.value })
                  }
                />
              </div>

              <div>
                <Label className="mb-2 block">Button Link (Optional)</Label>
                <Input
                  placeholder="#contact"
                  value={addData.buttonLink}
                  onChange={(e) =>
                    setAddData({ ...addData, buttonLink: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Service Image (Optional)</Label>
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
                    Featured
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
              <Button onClick={createService} className="flex-1">
                Create Service
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------------- EDIT MODAL ---------------- */}
      <Dialog open={editModal} onOpenChange={setEditModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g., Classic Elegance"
                value={editData.title || ""}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
              />
            </div>

            <div>
              <Label className="mb-2 block">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Describe this service..."
                value={editData.description || ""}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Icon</Label>
                <Select
                  value={editData.icon}
                  onValueChange={(val) =>
                    setEditData({ ...editData, icon: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <SelectItem key={opt.name} value={opt.name}>
                          <div className="flex items-center gap-2">
                            <Icon size={16} />
                            {opt.name}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">Color Gradient</Label>
                <Select
                  value={editData.color}
                  onValueChange={(val) =>
                    setEditData({ ...editData, color: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorPresets.map((preset) => (
                      <SelectItem key={preset.value} value={preset.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded bg-gradient-to-r ${preset.value}`}
                          />
                          {preset.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Features (up to 5)</Label>
              <div className="space-y-2">
                {editData.features?.map((feat: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Feature ${index + 1}`}
                      value={feat}
                      onChange={(e) => {
                        const newFeatures = [...editData.features];
                        newFeatures[index] = e.target.value;
                        setEditData({ ...editData, features: newFeatures });
                      }}
                    />
                    {index >= 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newFeatures = editData.features.filter(
                            (_: string, i: number) => i !== index
                          );
                          setEditData({ ...editData, features: newFeatures });
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                ))}
                {editData.features?.length < 5 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditData({
                        ...editData,
                        features: [...editData.features, ""],
                      });
                    }}
                  >
                    <Plus size={16} className="mr-1" />
                    Add Feature
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Button Text</Label>
                <Input
                  placeholder="Lihat Tema Ini"
                  value={editData.buttonText || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, buttonText: e.target.value })
                  }
                />
              </div>

              <div>
                <Label className="mb-2 block">Button Link (Optional)</Label>
                <Input
                  placeholder="#contact"
                  value={editData.buttonLink || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, buttonLink: e.target.value })
                  }
                />
              </div>
            </div>

            {editData.image && typeof editData.image === "string" && (
              <div className="border rounded p-3">
                <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                <img
                  src={editData.image}
                  alt="Current"
                  className="w-32 h-32 rounded-lg object-cover"
                />
              </div>
            )}

            <div>
              <Label className="mb-2 block">
                Update Image (Optional - Leave empty to keep current)
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
                    Featured
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
              <Button onClick={updateService} className="flex-1">
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
            <DialogTitle>Delete Service?</DialogTitle>
          </DialogHeader>

          <p className="text-gray-600">
            This action cannot be undone. The service will be permanently
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
              Delete Service
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------------- SETTINGS MODAL ---------------- */}
      <Dialog open={settingsModal} onOpenChange={setSettingsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Service Display Settings</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                Control how services are displayed on your website
              </AlertDescription>
            </Alert>

            <div>
              <Label className="mb-2 block">Maximum Services to Display</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={settings.maxDisplay}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maxDisplay: Number(e.target.value),
                  })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Number of services to show on homepage (1-10)
              </p>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center space-x-2 mb-3">
                <Checkbox
                  id="flip-animation"
                  checked={settings.enableFlipAnimation}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      enableFlipAnimation: !!checked,
                    })
                  }
                />
                <label
                  htmlFor="flip-animation"
                  className="text-sm cursor-pointer"
                >
                  Enable flip animation on hover
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto-rotate"
                  checked={settings.autoRotate}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoRotate: !!checked })
                  }
                />
                <label htmlFor="auto-rotate" className="text-sm cursor-pointer">
                  Auto-rotate cards
                </label>
              </div>

              {settings.autoRotate && (
                <div className="mt-3 ml-6">
                  <Label className="mb-2 block text-xs">
                    Rotation Interval (ms)
                  </Label>
                  <Input
                    type="number"
                    min="2000"
                    max="10000"
                    step="1000"
                    value={settings.autoRotateInterval}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        autoRotateInterval: Number(e.target.value),
                      })
                    }
                  />
                </div>
              )}
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
