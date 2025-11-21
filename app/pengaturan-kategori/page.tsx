"use client";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import ColorPicker from "@/components/ColorPicker";
import IconPicker from "@/components/IconPicker";

export default function PengaturanKategori() {
  const [categories, setCategories] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", icon: "", color: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchCategories = () => {
    setLoading(true);
    fetch("/api/category")
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        setCategories(data.categories);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Gagal mengambil kategori");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    try {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal tambah kategori");
      setShowModal(false);
      setForm({ name: "", icon: "", color: "" });
      fetchCategories();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#181F2C] font-sans flex flex-col items-center">
      <div className="w-full max-w-sm px-6 pt-8 flex items-center justify-between">
        <h2 className="text-white text-lg font-semibold">Pengaturan Kategori</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg" onClick={() => setShowModal(true)}>
          + Kategori
        </button>
      </div>
      <div className="w-full max-w-sm px-6 mt-6 flex flex-col gap-4">
        {loading ? (
          <span className="text-white">Loading...</span>
        ) : error ? (
          <span className="text-red-400">{error}</span>
        ) : categories.length === 0 ? (
          <span className="text-white">Belum ada kategori</span>
        ) : (
          categories.map((cat, idx) => (
            <div key={cat.id || idx} className="bg-gradient-to-br from-[#1B2A49] to-[#2E3A5A] rounded-xl p-4 flex flex-col">
              <span className="text-white text-lg font-semibold">{cat.name}</span>
              <span className="text-white text-xs">Icon: {cat.icon || '-'}</span>
              <span className="text-white text-xs">Warna: {cat.color || '-'}</span>
            </div>
          ))
        )}
      </div>
      {/* Modal Tambah Kategori */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#232B3E] rounded-2xl p-6 w-full max-w-xs flex flex-col">
            <h3 className="text-white text-lg font-semibold mb-4">Tambah Kategori</h3>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                className="rounded-lg px-4 py-2 bg-[#181F2C] text-white placeholder:text-white/60"
                placeholder="Nama Kategori"
                required
              />
              <label className="text-white text-xs mb-1">Icon Kategori</label>
              <IconPicker value={form.icon} onChange={(icon) => setForm({ ...form, icon })} />
              <label className="text-white text-xs mb-1">Warna Kategori</label>
              <ColorPicker value={form.color} onChange={(color) => setForm({ ...form, color })} />
              {formError && <span className="text-red-400 text-xs">{formError}</span>}
              <div className="flex gap-2 mt-2">
                <button type="button" className="flex-1 py-2 rounded-lg bg-gray-500 text-white" onClick={() => setShowModal(false)} disabled={formLoading}>
                  Batal
                </button>
                <button type="submit" className="flex-1 py-2 rounded-lg bg-green-600 text-white font-semibold" disabled={formLoading}>
                  {formLoading ? "Memproses..." : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}
