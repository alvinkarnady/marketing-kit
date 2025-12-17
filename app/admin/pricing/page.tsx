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
  Home,
  Eye,
  EyeOff,
  Crown,
  Award,
  Star,
  Sparkles,
  Zap,
  Heart,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Icon options
const iconOptions = [
  { value: "Star", label: "Star", Icon: Star },
  { value: "Crown", label: "Crown", Icon: Crown },
  { value: "Sparkles", label: "Sparkles", Icon: Sparkles },
  { value: "Zap", label: "Zap", Icon: Zap },
  { value: "Award", label: "Award", Icon: Award },
  { value: "Heart", label: "Heart", Icon: Heart },
];

// Gradient presets
const gradientOptions = [
  {
    value: "from-gray-100 to-gray-200",
    label: "Gray",
    color: "bg-gradient-to-r from-gray-100 to-gray-200",
  },
  {
    value: "from-amber-400 via-yellow-400 to-amber-500",
    label: "Gold",
    color: "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500",
  },
  {
    value: "from-purple-500 via-pink-500 to-purple-600",
    label: "Purple",
    color: "bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600",
  },
  {
    value: "from-blue-400 to-cyan-500",
    label: "Blue",
    color: "bg-gradient-to-r from-blue-400 to-cyan-500",
  },
  {
    value: "from-emerald-400 to-teal-500",
    label: "Green",
    color: "bg-gradient-to-r from-emerald-400 to-teal-500",
  },
  {
    value: "from-red-400 to-pink-500",
    label: "Red",
    color: "bg-gradient-to-r from-red-400 to-pink-500",
  },
];

// Button style presets
const buttonStyleOptions = [
  {
    value:
      "bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700",
    label: "Dark",
  },
  { value: "bg-white text-amber-700 hover:bg-amber-50", label: "White" },
  {
    value:
      "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500",
    label: "Gradient",
  },
  {
    value:
      "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500",
    label: "Blue",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Settings
  const [settingsModal, setSettingsModal] = useState(false);
  const [settings, setSettings] = useState({
    maxDisplay: 3,
    whatsappNumber: "6281248406898",
  });

  // ADD
  const [addModal, setAddModal] = useState(false);
  const [addData, setAddData] = useState({
    name: "",
    subtitle: "",
    price: "",
    period: "/undangan",
    features: [""],
    isActive: true,
    isHighlight: false,
    isPopular: false,
    priority: 0,
    icon: "Star",
    gradient: "from-gray-100 to-gray-200",
    buttonStyle:
      "bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700",
    discountPrice: "",
    discountEndDate: "",
    whatsappMessage: "",
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
      const res = await fetch("/api/pricing");
      const data = await res.json();
      setPlans(data || []);

      const resSettings = await fetch("/api/pricing/settings");
      const settingsData = await resSettings.json();
      setSettings(settingsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // FILTERED PLANS
  const filteredPlans = plans.filter((plan: any) =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ADD FEATURE
  const addFeature = (isEdit: boolean = false) => {
    if (isEdit) {
      setEditData({
        ...editData,
        features: [...editData.features, ""],
      });
    } else {
      setAddData({
        ...addData,
        features: [...addData.features, ""],
      });
    }
  };

  // REMOVE FEATURE
  const removeFeature = (index: number, isEdit: boolean = false) => {
    if (isEdit) {
      setEditData({
        ...editData,
        features: editData.features.filter((_: any, i: number) => i !== index),
      });
    } else {
      setAddData({
        ...addData,
        features: addData.features.filter((_: any, i: number) => i !== index),
      });
    }
  };

  // UPDATE FEATURE
  const updateFeature = (
    index: number,
    value: string,
    isEdit: boolean = false
  ) => {
    if (isEdit) {
      const newFeatures = [...editData.features];
      newFeatures[index] = value;
      setEditData({ ...editData, features: newFeatures });
    } else {
      const newFeatures = [...addData.features];
      newFeatures[index] = value;
      setAddData({ ...addData, features: newFeatures });
    }
  };

  // CREATE PLAN
  const createPlan = async () => {
    if (!addData.name || !addData.subtitle || !addData.price) {
      alert("Please fill required fields");
      return;
    }

    // Filter empty features
    const cleanFeatures = addData.features.filter((f) => f.trim() !== "");
    if (cleanFeatures.length === 0) {
      alert("Please add at least one feature");
      return;
    }

    try {
      await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...addData,
          features: cleanFeatures,
        }),
      });

      setAddModal(false);
      setAddData({
        name: "",
        subtitle: "",
        price: "",
        period: "/undangan",
        features: [""],
        isActive: true,
        isHighlight: false,
        isPopular: false,
        priority: 0,
        icon: "Star",
        gradient: "from-gray-100 to-gray-200",
        buttonStyle:
          "bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700",
        discountPrice: "",
        discountEndDate: "",
        whatsappMessage: "",
      });
      loadData();
    } catch (error) {
      console.error("Create error:", error);
      alert("Failed to create plan");
    }
  };

  // OPEN EDIT
  const openEdit = (plan: any) => {
    setEditData({
      ...plan,
      price: String(plan.price),
      priority: String(plan.priority),
      discountPrice: plan.discountPrice ? String(plan.discountPrice) : "",
      discountEndDate: plan.discountEndDate
        ? new Date(plan.discountEndDate).toISOString().split("T")[0]
        : "",
    });
    setEditModal(true);
  };

  // UPDATE PLAN
  const updatePlan = async () => {
    if (!editData.name || !editData.subtitle || !editData.price) {
      alert("Please fill required fields");
      return;
    }

    const cleanFeatures = editData.features.filter(
      (f: string) => f.trim() !== ""
    );
    if (cleanFeatures.length === 0) {
      alert("Please add at least one feature");
      return;
    }

    try {
      await fetch(`/api/pricing/${editData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editData,
          features: cleanFeatures,
        }),
      });

      setEditModal(false);
      loadData();
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update plan");
    }
  };

  // TOGGLE ACTIVE
  const toggleActive = async (id: number, currentStatus: boolean) => {
    const plan = plans.find((p: any) => p.id === id);
    if (!plan) return;

    try {
      await fetch(`/api/pricing/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...plan,
          isActive: !currentStatus,
        }),
      });
      loadData();
    } catch (error) {
      console.error("Toggle error:", error);
    }
  };

  // DELETE
  const confirmDelete = async () => {
    try {
      await fetch(`/api/pricing/${deleteId}`, {
        method: "DELETE",
      });

      setDeleteModal(false);
      loadData();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete plan");
    }
  };

  // UPDATE SETTINGS
  const updateSettings = async () => {
    try {
      await fetch("/api/pricing/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      setSettingsModal(false);
      loadData();
    } catch (error) {
      console.error("Update settings error:", error);
      alert("Failed to update settings");
    }
  };

  // GET ICON COMPONENT
  const getIconComponent = (iconName: string) => {
    const icon = iconOptions.find((opt) => opt.value === iconName);
    return icon ? icon.Icon : Star;
  };

  // Stats
  const stats = {
    total: plans.length,
    active: plans.filter((p: any) => p.isActive).length,
    highlighted: plans.filter((p: any) => p.isHighlight).length,
    discounted: plans.filter((p: any) => {
      const now = new Date();
      return (
        p.discountPrice &&
        p.discountEndDate &&
        new Date(p.discountEndDate) > now
      );
    }).length,
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Pricing Plans</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage pricing packages and settings
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
            <Award className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Total Plans</span>
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
            <Crown className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-gray-600">Highlighted</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">
            {stats.highlighted}
          </p>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">Discounted</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {stats.discounted}
          </p>
        </div>
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
              placeholder="Search plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button onClick={() => setAddModal(true)} className="gap-2">
            <Plus size={18} />
            Add Plan
          </Button>
        </div>

        {searchQuery && (
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredPlans.length} of {plans.length} plans
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left text-sm font-semibold">Plan</th>
              <th className="p-3 text-left text-sm font-semibold">Price</th>
              <th className="p-3 text-left text-sm font-semibold">Features</th>
              <th className="p-3 text-left text-sm font-semibold">Status</th>
              <th className="p-3 text-left text-sm font-semibold">Priority</th>
              <th className="p-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPlans.length > 0 ? (
              filteredPlans.map((plan: any) => {
                const IconComponent = getIconComponent(plan.icon);
                const now = new Date();
                const hasActiveDiscount =
                  plan.discountPrice &&
                  plan.discountEndDate &&
                  new Date(plan.discountEndDate) > now;

                return (
                  <tr key={plan.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-r ${plan.gradient} flex items-center justify-center`}
                        >
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold">{plan.name}</p>
                          <p className="text-xs text-gray-500">
                            {plan.subtitle}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <div>
                        {hasActiveDiscount ? (
                          <>
                            <p className="font-bold text-purple-600">
                              Rp{" "}
                              {Number(plan.discountPrice).toLocaleString(
                                "id-ID"
                              )}
                            </p>
                            <p className="text-xs text-gray-400 line-through">
                              Rp {Number(plan.price).toLocaleString("id-ID")}
                            </p>
                          </>
                        ) : (
                          <p className="font-bold">
                            Rp {Number(plan.price).toLocaleString("id-ID")}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">{plan.period}</p>
                      </div>
                    </td>

                    <td className="p-3">
                      <p className="text-sm text-gray-600">
                        {plan.features.length} features
                      </p>
                    </td>

                    <td className="p-3">
                      <div className="flex flex-col gap-1">
                        {plan.isActive && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs w-fit">
                            <Eye size={12} />
                            Active
                          </span>
                        )}
                        {plan.isHighlight && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs w-fit">
                            <Crown size={12} />
                            Highlight
                          </span>
                        )}
                        {plan.isPopular && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs w-fit">
                            <Award size={12} />
                            Popular
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <ArrowUp size={14} className="text-gray-400" />
                        <span className="font-medium">{plan.priority}</span>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleActive(plan.id, plan.isActive)}
                          >
                            {plan.isActive ? (
                              <EyeOff size={14} />
                            ) : (
                              <Eye size={14} />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEdit(plan)}
                          >
                            Edit
                          </Button>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setDeleteId(plan.id);
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
                  No plans found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals will continue below... */}
      {/* ---------------- ADD MODAL ---------------- */}
      <Dialog open={addModal} onOpenChange={setAddModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Pricing Plan</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>
                  Plan Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g., Premium"
                  value={addData.name}
                  onChange={(e) =>
                    setAddData({ ...addData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>
                  Subtitle <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g., Paling Populer"
                  value={addData.subtitle}
                  onChange={(e) =>
                    setAddData({ ...addData, subtitle: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Price */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>
                  Price (Rp) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  placeholder="199000"
                  value={addData.price}
                  onChange={(e) =>
                    setAddData({ ...addData, price: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Period</Label>
                <Input
                  placeholder="/undangan"
                  value={addData.period}
                  onChange={(e) =>
                    setAddData({ ...addData, period: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Priority (Order)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={addData.priority}
                  onChange={(e) =>
                    setAddData({ ...addData, priority: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            {/* Features */}
            <div>
              <Label className="mb-2 block">
                Features <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-2">
                {addData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Feature ${index + 1}`}
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                    />
                    {addData.features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeFeature(index)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addFeature()}
                className="mt-2"
              >
                <Plus size={14} className="mr-1" />
                Add Feature
              </Button>
            </div>

            {/* Styling */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Icon</Label>
                <Select
                  value={addData.icon}
                  onValueChange={(val) => setAddData({ ...addData, icon: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
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
                <Label>Gradient</Label>
                <Select
                  value={addData.gradient}
                  onValueChange={(val) =>
                    setAddData({ ...addData, gradient: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {gradientOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-4 rounded ${opt.color}`} />
                          {opt.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Button Style</Label>
                <Select
                  value={addData.buttonStyle}
                  onValueChange={(val) =>
                    setAddData({ ...addData, buttonStyle: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {buttonStyleOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Display Settings */}
            <div className="border-t pt-4">
              <Label className="mb-3 block font-semibold">
                Display Settings
              </Label>
              <div className="grid md:grid-cols-3 gap-4">
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
                    id="add-highlight"
                    checked={addData.isHighlight}
                    onCheckedChange={(checked) =>
                      setAddData({ ...addData, isHighlight: !!checked })
                    }
                  />
                  <label
                    htmlFor="add-highlight"
                    className="text-sm cursor-pointer"
                  >
                    Highlight (Bigger card)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="add-popular"
                    checked={addData.isPopular}
                    onCheckedChange={(checked) =>
                      setAddData({ ...addData, isPopular: !!checked })
                    }
                  />
                  <label
                    htmlFor="add-popular"
                    className="text-sm cursor-pointer"
                  >
                    Popular Badge
                  </label>
                </div>
              </div>
            </div>

            {/* Discount (Optional) */}
            <div className="border-t pt-4">
              <Label className="mb-3 block font-semibold">
                Discount Settings (Optional)
              </Label>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Discount Price (Rp)</Label>
                  <Input
                    type="number"
                    placeholder="150000"
                    value={addData.discountPrice}
                    onChange={(e) =>
                      setAddData({ ...addData, discountPrice: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Discount End Date</Label>
                  <Input
                    type="date"
                    value={addData.discountEndDate}
                    onChange={(e) =>
                      setAddData({
                        ...addData,
                        discountEndDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* WhatsApp Message */}
            <div>
              <Label>Custom WhatsApp Message (Optional)</Label>
              <Textarea
                placeholder="Halo, saya tertarik dengan paket..."
                value={addData.whatsappMessage}
                onChange={(e) =>
                  setAddData({ ...addData, whatsappMessage: e.target.value })
                }
                rows={2}
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to use default message
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setAddModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={createPlan} className="flex-1">
                Create Plan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------------- EDIT MODAL (Similar structure) ---------------- */}
      <Dialog open={editModal} onOpenChange={setEditModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Pricing Plan</DialogTitle>
          </DialogHeader>

          {/* Same fields as Add Modal but with editData */}
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Plan Name</Label>
                <Input
                  value={editData.name || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Input
                  value={editData.subtitle || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, subtitle: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Price (Rp)</Label>
                <Input
                  type="number"
                  value={editData.price || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, price: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Period</Label>
                <Input
                  value={editData.period || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, period: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Priority</Label>
                <Input
                  type="number"
                  value={editData.priority || 0}
                  onChange={(e) =>
                    setEditData({ ...editData, priority: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Features</Label>
              <div className="space-y-2">
                {editData.features?.map((feature: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) =>
                        updateFeature(index, e.target.value, true)
                      }
                    />
                    {editData.features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeFeature(index, true)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addFeature(true)}
                className="mt-2"
              >
                <Plus size={14} className="mr-1" />
                Add Feature
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Icon</Label>
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
                <Label>Gradient</Label>
                <Select
                  value={editData.gradient}
                  onValueChange={(val) =>
                    setEditData({ ...editData, gradient: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {gradientOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-4 rounded ${opt.color}`} />
                          {opt.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Button Style</Label>
                <Select
                  value={editData.buttonStyle}
                  onValueChange={(val) =>
                    setEditData({ ...editData, buttonStyle: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {buttonStyleOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t pt-4">
              <Label className="mb-3 block font-semibold">
                Display Settings
              </Label>
              <div className="grid md:grid-cols-3 gap-4">
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
                    Active
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-highlight"
                    checked={editData.isHighlight}
                    onCheckedChange={(checked) =>
                      setEditData({ ...editData, isHighlight: !!checked })
                    }
                  />
                  <label
                    htmlFor="edit-highlight"
                    className="text-sm cursor-pointer"
                  >
                    Highlight
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-popular"
                    checked={editData.isPopular}
                    onCheckedChange={(checked) =>
                      setEditData({ ...editData, isPopular: !!checked })
                    }
                  />
                  <label
                    htmlFor="edit-popular"
                    className="text-sm cursor-pointer"
                  >
                    Popular
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <Label className="mb-3 block font-semibold">
                Discount Settings
              </Label>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Discount Price</Label>
                  <Input
                    type="number"
                    value={editData.discountPrice || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        discountPrice: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Discount End Date</Label>
                  <Input
                    type="date"
                    value={editData.discountEndDate || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        discountEndDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Custom WhatsApp Message</Label>
              <Textarea
                value={editData.whatsappMessage || ""}
                onChange={(e) =>
                  setEditData({ ...editData, whatsappMessage: e.target.value })
                }
                rows={2}
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
              <Button onClick={updatePlan} className="flex-1">
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
            <DialogTitle>Delete Pricing Plan?</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">This action cannot be undone.</p>
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
              Delete Plan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------------- SETTINGS MODAL ---------------- */}
      <Dialog open={settingsModal} onOpenChange={setSettingsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pricing Settings</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                Control pricing display and WhatsApp integration
              </AlertDescription>
            </Alert>

            <div>
              <Label>Maximum Plans to Display</Label>
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
                How many plans to show on homepage (1-10)
              </p>
            </div>

            <div>
              <Label>WhatsApp Number</Label>
              <Input
                placeholder="628123456789"
                value={settings.whatsappNumber}
                onChange={(e) =>
                  setSettings({ ...settings, whatsappNumber: e.target.value })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: 628xxx (without +)
              </p>
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
