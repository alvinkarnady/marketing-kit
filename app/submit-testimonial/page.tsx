"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, Star, CheckCircle, ArrowLeft, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SubmitTestimonialPage() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "Pasangan Pengantin",
    email: "",
    rating: 5,
    text: "",
    event: "",
    weddingDate: "",
    themeId: "",
    image: null as File | null,
  });

  // Load themes
  useEffect(() => {
    async function loadThemes() {
      try {
        const res = await fetch("/api/themes");
        const data = await res.json();
        setThemes(data.data || []);
      } catch (error) {
        console.error("Failed to load themes:", error);
      }
    }
    loadThemes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.text || !formData.event) {
      alert("Mohon lengkapi field yang wajib diisi");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("role", formData.role);
      fd.append("email", formData.email);
      fd.append("rating", String(formData.rating));
      fd.append("text", formData.text);
      fd.append("event", formData.event);
      fd.append("weddingDate", formData.weddingDate);
      fd.append("themeId", formData.themeId);
      fd.append("isAdminCreate", "false"); // Mark as public submission

      if (formData.image) {
        fd.append("image", formData.image);
      }

      const res = await fetch("/api/testimonials", {
        method: "POST",
        body: fd,
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Gagal mengirim testimoni. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/30 to-white flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-500 mb-6"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl font-bold text-[#3b2a1a] mb-4">
            Terima Kasih! 🎉
          </h1>

          <p className="text-[#6b4e2f]/80 text-lg mb-8 leading-relaxed">
            Testimoni Anda telah berhasil dikirim dan akan segera ditinjau oleh
            tim kami. Kami sangat menghargai feedback Anda!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-gradient-to-r from-[#d4af37] to-[#b38b00] hover:opacity-90"
            >
              Kembali ke Beranda
            </Button>

            <Button
              variant="outline"
              onClick={() => setSubmitted(false)}
              className="border-amber-200"
            >
              Kirim Testimoni Lain
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/30 to-white py-12 px-6">
      {/* Background decorations */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-20 left-0 w-96 h-96 bg-gradient-to-br from-amber-200/20 to-yellow-300/20 rounded-full blur-3xl"
      />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Back Button */}
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 text-[#6b4e2f] hover:text-[#d4af37] mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Kembali ke Beranda
        </motion.a>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 mb-6">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">
              Testimoni
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#b38b00]">
              Bagikan Pengalaman
            </span>
            <br />
            <span className="text-[#3b2a1a]">Anda dengan Kami</span>
          </h1>

          <p className="text-[#6b4e2f]/80 max-w-2xl mx-auto">
            Testimoni Anda sangat berarti bagi kami dan membantu pasangan lain
            dalam memilih tema undangan yang tepat.
          </p>
        </motion.div>

        {/* Info Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Alert className="mb-8 bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-800">
              <strong>Info:</strong> Testimoni Anda akan ditinjau oleh tim kami
              sebelum ditampilkan di website. Terima kasih atas pengertiannya!
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-6 md:p-10 space-y-6"
        >
          {/* Name & Role */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="mb-2 block">
                Nama Anda <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g., Andi & Siti"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label className="mb-2 block">Role</Label>
              <Input
                placeholder="Pasangan Pengantin"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label className="mb-2 block">Email (Optional)</Label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <p className="text-xs text-gray-500 mt-1">
              Kami tidak akan membagikan email Anda
            </p>
          </div>

          {/* Rating */}
          <div>
            <Label className="mb-2 block">Rating</Label>
            <div className="flex gap-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating })}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg border-2 transition-all ${
                    formData.rating === rating
                      ? "border-amber-400 bg-amber-50"
                      : "border-gray-200 hover:border-amber-300"
                  }`}
                >
                  {[...Array(rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        formData.rating === rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-400"
                      }
                    />
                  ))}
                </button>
              ))}
            </div>
          </div>

          {/* Testimonial Text */}
          <div>
            <Label className="mb-2 block">
              Testimoni Anda <span className="text-red-500">*</span>
            </Label>
            <Textarea
              placeholder="Ceritakan pengalaman Anda menggunakan layanan kami..."
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
              rows={5}
              required
            />
          </div>

          {/* Event & Date */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="mb-2 block">
                Event <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g., Pernikahan, Januari 2024"
                value={formData.event}
                onChange={(e) =>
                  setFormData({ ...formData, event: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label className="mb-2 block">
                Tanggal Pernikahan (Optional)
              </Label>
              <Input
                type="date"
                value={formData.weddingDate}
                onChange={(e) =>
                  setFormData({ ...formData, weddingDate: e.target.value })
                }
              />
            </div>
          </div>

          {/* Theme Used */}
          <div>
            <Label className="mb-2 block">Tema yang Digunakan (Optional)</Label>
            <Select
              value={formData.themeId || "none"}
              onValueChange={(val) =>
                setFormData({ ...formData, themeId: val === "none" ? "" : val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tidak memilih tema</SelectItem>
                {themes.map((theme: any) => (
                  <SelectItem key={theme.id} value={String(theme.id)}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Photo Upload */}
          <div>
            <Label className="mb-2 block">Foto Anda (Optional)</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e: any) =>
                setFormData({ ...formData, image: e.target.files[0] })
              }
            />
            <p className="text-xs text-gray-500 mt-1">
              Jika tidak upload foto, kami akan menggunakan inisial nama Anda
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#d4af37] to-[#b38b00] hover:opacity-90 py-6 text-lg font-semibold"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Mengirim...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Heart size={20} />
                Kirim Testimoni
              </span>
            )}
          </Button>
        </motion.form>
      </div>
    </div>
  );
}
