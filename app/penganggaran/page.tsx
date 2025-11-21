"use client";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import IconPicker from "@/components/IconPicker";
import * as LucideIcons from "lucide-react";
import React from "react";

export default function Penganggaran() {
  const [budgets, setBudgets] = useState<Array<any>>([]);
  const [categories, setCategories] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ categoryId: "", limit: "", period: "bulanan", startDate: "", endDate: "" });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const iconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/budget")
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        setBudgets(data.budgets);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Gagal mengambil data penganggaran");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/category-list")
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  // Pie chart data
  const pieData = budgets.map((b) => ({
    name: b.category,
    value: b.limit,
    color: b.color || "#FFD54F",
  }));

  return (
    <div className="min-h-screen bg-[#181F2C] font-sans flex flex-col items-center">
      <div className="w-full max-w-sm px-6 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-white text-lg font-semibold">Penganggaran</h2>
        </div>
        <Image src="/monuvo.png" alt="Logo" width={48} height={48} />
      </div>
      <div className="w-full max-w-sm px-6 mt-6">
        <div className="bg-gradient-to-br from-[#1B2A49] to-[#2E3A5A] rounded-xl p-4 flex flex-col items-center">
          <span className="text-white text-base font-semibold mb-2">Pengeluaran Kategori</span>
          <ResponsiveContainer width={240} height={240}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(1) : 0}%`}
              >
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Card Anggaran */}
      <div className="w-full max-w-sm px-6 mt-8 flex flex-col gap-4">
        {loading ? (
          <span className="text-white">Loading...</span>
        ) : error ? (
          <span className="text-red-400">{error}</span>
        ) : budgets.length === 0 ? (
          <span className="text-white">Belum ada data penganggaran</span>
        ) : (
          budgets.map((b, idx) => (
            <div key={b.id || idx} className="bg-[#232B3E] rounded-xl p-4 flex items-center gap-4 shadow">
              <div className="w-12 h-12 flex items-center justify-center rounded-full" style={{ background: b.color }}>
                {/* Icon Lucide jika ada, fallback bulatan */}
                {b.icon && typeof b.icon === "string" && (LucideIcons as any)[b.icon] ? (
                  React.createElement((LucideIcons as any)[b.icon], { size: 28, color: '#fff' })
                ) : (
                  <span />
                )}
              </div>
              <div className="flex-1">
                <div className="text-white font-semibold text-base">{b.category}</div>
                <div className="text-white/80 text-sm">Limit: Rp {b.limit.toLocaleString('id-ID')},00</div>
                <div className="text-white/60 text-xs">Periode: {b.period}</div>
                <div className="text-white/60 text-xs">{new Date(b.startdate || b.startDate).toLocaleDateString('id-ID')} - {new Date(b.enddate || b.endDate).toLocaleDateString('id-ID')}</div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Modal Form Anggaran */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#232B3E] rounded-xl p-6 w-[320px] flex flex-col gap-4">
            <h3 className="text-white text-base font-semibold mb-2">Tambah Anggaran</h3>
            <select
              className="px-3 py-2 rounded bg-[#181F2C] text-white"
              value={form.categoryId || ""}
              onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
            >
              <option value="">Pilih Kategori</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <label className="text-white text-sm font-medium">Limit Anggaran (Rp)</label>
            <input
              type="number"
              min={1}
              placeholder="Nominal (Rp)"
              className="px-3 py-2 rounded bg-[#181F2C] text-white"
              value={form.limit}
              onChange={e => setForm(f => ({ ...f, limit: e.target.value }))}
            />
            {form.limit !== "" && Number(form.limit) <= 0 && (
              <span className="text-red-400 text-xs">Limit harus lebih dari 0</span>
            )}
            <label className="text-white text-sm font-medium">Periode</label>
            <select
              className="px-3 py-2 rounded bg-[#181F2C] text-white"
              value={form.period}
              onChange={e => setForm(f => ({ ...f, period: e.target.value }))}
            >
              <option value="bulanan">Bulanan</option>
              <option value="mingguan">Mingguan</option>
              <option value="tahunan">Tahunan</option>
            </select>
            <label className="text-white text-sm font-medium">Tanggal Mulai</label>
            <input
              type="date"
              className="px-3 py-2 rounded bg-[#181F2C] text-white"
              value={form.startDate}
              onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
            />
            <label className="text-white text-sm font-medium">Tanggal Selesai</label>
            <input
              type="date"
              className="px-3 py-2 rounded bg-[#181F2C] text-white"
              value={form.endDate}
              onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
            />
            <div className="flex gap-2 mt-2">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                disabled={submitting || !form.limit || Number(form.limit) <= 0 || !form.categoryId || !form.startDate || !form.endDate}
                onClick={async () => {
                  setSubmitting(true);
                  try {
                    const res = await fetch("/api/budget", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        categoryId: form.categoryId,
                        limit: Number(form.limit),
                        period: form.period,
                        startDate: form.startDate,
                        endDate: form.endDate,
                      }),
                    });
                    if (!res.ok) throw new Error(await res.text());
                    setShowModal(false);
                    setForm({ categoryId: "", limit: "", period: "bulanan", startDate: "", endDate: "" });
                    router.refresh();
                  } catch (err) {
                    alert("Gagal tambah anggaran");
                  }
                  setSubmitting(false);
                }}
              >Simpan</button>
              <button
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm"
                onClick={() => setShowModal(false)}
              >Batal</button>
            </div>
          </div>
        </div>
      )}
      {/* Floating Button */}
      <button
        className="fixed bottom-20 right-6 bg-green-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50 hover:bg-green-600 text-3xl"
        onClick={() => setShowModal(true)}
        aria-label="Tambah Anggaran"
      >
        +
      </button>
      <BottomNav />
    </div>
  );
}
