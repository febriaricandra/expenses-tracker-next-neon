"use client";
import BottomNav from "@/components/BottomNav";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Pengeluaran() {
  const [transactions, setTransactions] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", amount: "", date: "", category: "", description: "", savingsid: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [categories, setCategories] = useState<Array<any>>([]);
  const [savings, setSavings] = useState<Array<any>>([]);
  const [editModal, setEditModal] = useState<{ open: boolean; tx: any | null }>({ open: false, tx: null });
  const [editForm, setEditForm] = useState({ title: "", amount: "", date: "", category: "", description: "", savingsid: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const fetchTransactions = () => {
    setLoading(true);
    fetch("/api/transaction?type=expense")
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        setTransactions(data.transactions);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Gagal mengambil data transaksi");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTransactions();
    fetch("/api/category-list")
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        setCategories(data.categories);
      })
      .catch(() => {});
    fetch("/api/savings")
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        setSavings(data.savings);
      })
      .catch(() => {});
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    try {
      const res = await fetch("/api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
          type: "expense",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal tambah transaksi");
      setShowModal(false);
      setForm({ title: "", amount: "", date: "", category: "", description: "", savingsid: "" });
      fetchTransactions();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#181F2C] font-sans flex flex-col items-center">
      <div className="w-full max-w-sm px-6 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/window.svg" alt="Pengeluaran" width={32} height={32} />
          <h2 className="text-white text-lg font-semibold">Pengeluaran</h2>
        </div>
        <Image src="/monuvo.png" alt="Logo" width={48} height={48} />
      </div>
      <div className="w-full max-w-sm px-6 mt-6">
        <div className="bg-gradient-to-br from-[#1B2A49] to-[#2E3A5A] rounded-xl p-4 text-center">
          <span className="text-white text-lg font-semibold">Rp {transactions.reduce((acc, tx) => acc + Math.abs(tx.amount), 0).toLocaleString("id-ID")},00</span>
        </div>
      </div>
      <div className="w-full max-w-sm px-6 mt-8">
        <h3 className="text-white text-base font-semibold mb-4">Transaksi</h3>
        <button className="w-full mb-4 rounded-full px-4 py-2 bg-red-600 text-white font-semibold" onClick={() => setShowModal(true)}>
          + Tambah Pengeluaran
        </button>
        <input className="w-full mb-4 rounded-full px-4 py-2 bg-[#232B3E] text-white placeholder:text-white/60" placeholder="Cari transaksi" />
        <div className="flex flex-col gap-4">
          {loading ? (
            <span className="text-white">Loading...</span>
          ) : error ? (
            <span className="text-red-400">{error}</span>
          ) : transactions.length === 0 ? (
            <span className="text-white">Belum ada transaksi</span>
          ) : (
            transactions.map((tx, idx) => (
              <div key={tx.id || idx} className="bg-[#232B3E] rounded-xl p-4 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">{tx.title}</span>
                  <span className="font-bold text-red-400">-Rp {Math.abs(tx.amount).toLocaleString("id-ID")},00</span>
                </div>
                <span className="text-xs text-white/70">{tx.date}</span>
                <span className="text-xs text-white/60">{tx.category} - {tx.description}</span>
                <span className="text-xs text-blue-300">{tx.savings_name ? `Tabungan: ${tx.savings_name}` : tx.savingsid ? `Tabungan ID: ${tx.savingsid}` : ""}</span>
                <button className="text-xs text-blue-400 mt-1 self-end" onClick={() => {
                  setEditForm({ title: tx.title, amount: tx.amount, date: tx.date, category: tx.categoryid || tx.category, description: tx.description, savingsid: tx.savingsid || "" });
                  setEditModal({ open: true, tx });
                }}>Edit</button>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Modal Tambah Pengeluaran */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#232B3E] rounded-2xl p-6 w-full max-w-xs flex flex-col">
            <h3 className="text-white text-lg font-semibold mb-4">Tambah Pengeluaran</h3>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
              <input
                name="title"
                value={form.title}
                onChange={handleFormChange}
                className="rounded-lg px-4 py-2 bg-[#181F2C] text-white placeholder:text-white/60"
                placeholder="Judul"
                required
              />
              <input
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleFormChange}
                className="rounded-lg px-4 py-2 bg-[#181F2C] text-white placeholder:text-white/60"
                placeholder="Jumlah"
                required
              />
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleFormChange}
                className="rounded-lg px-4 py-2 bg-[#181F2C] text-white placeholder:text-white/60"
                required
              />
              <select
                name="category"
                value={form.category}
                onChange={handleFormChange}
                className="rounded-lg px-4 py-2 bg-[#181F2C] text-white"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <select
                name="savingsid"
                value={form.savingsid || ""}
                onChange={handleFormChange}
                className="rounded-lg px-4 py-2 bg-[#181F2C] text-white"
                required
              >
                <option value="">Pilih Tabungan</option>
                {savings.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.bank} - {s.accountNumber}</option>
                ))}
              </select>
              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                className="rounded-lg px-4 py-2 bg-[#181F2C] text-white placeholder:text-white/60"
                placeholder="Deskripsi (opsional)"
              />
              {formError && <span className="text-red-400 text-xs">{formError}</span>}
              <div className="flex gap-2 mt-2">
                <button type="button" className="flex-1 py-2 rounded-lg bg-gray-500 text-white" onClick={() => setShowModal(false)} disabled={formLoading}>
                  Batal
                </button>
                <button type="submit" className="flex-1 py-2 rounded-lg bg-red-600 text-white font-semibold" disabled={formLoading}>
                  {formLoading ? "Memproses..." : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal Edit Pengeluaran */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#232B3E] rounded-2xl p-6 w-full max-w-xs flex flex-col">
            <h3 className="text-white text-lg font-semibold mb-4">Edit Pengeluaran</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setEditLoading(true);
              setEditError("");
              try {
                const res = await fetch(`/api/transaction?id=${editModal.tx.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    ...editForm,
                    amount: Number(editForm.amount),
                    type: "expense",
                  }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Gagal edit transaksi");
                setEditModal({ open: false, tx: null });
                fetchTransactions();
              } catch (err: any) {
                setEditError(err.message);
              } finally {
                setEditLoading(false);
              }
            }} className="flex flex-col gap-3">
              <input name="title" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} className="rounded-lg px-4 py-2 bg-[#181F2C] text-white placeholder:text-white/60" placeholder="Judul" required />
              <input name="amount" type="number" value={editForm.amount} onChange={e => setEditForm(f => ({ ...f, amount: e.target.value }))} className="rounded-lg px-4 py-2 bg-[#181F2C] text-white placeholder:text-white/60" placeholder="Jumlah" required />
              <input name="date" type="date" value={editForm.date} onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))} className="rounded-lg px-4 py-2 bg-[#181F2C] text-white placeholder:text-white/60" required />
              <select name="category" value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))} className="rounded-lg px-4 py-2 bg-[#181F2C] text-white" required>
                <option value="">Pilih Kategori</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <select name="savingsid" value={editForm.savingsid} onChange={e => setEditForm(f => ({ ...f, savingsid: e.target.value }))} className="rounded-lg px-4 py-2 bg-[#181F2C] text-white" required>
                <option value="">Pilih Tabungan</option>
                {savings.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.bank} - {s.accountNumber}</option>
                ))}
              </select>
              <textarea name="description" value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} className="rounded-lg px-4 py-2 bg-[#181F2C] text-white placeholder:text-white/60" placeholder="Deskripsi (opsional)" />
              {editError && <span className="text-red-400 text-xs">{editError}</span>}
              <div className="flex gap-2 mt-2">
                <button type="button" className="flex-1 py-2 rounded-lg bg-gray-500 text-white" onClick={() => setEditModal({ open: false, tx: null })} disabled={editLoading}>Batal</button>
                <button type="submit" className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-semibold" disabled={editLoading}>{editLoading ? "Memproses..." : "Simpan"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="fixed bottom-0 left-0 w-full bg-[#232B3E] py-4 flex justify-center">
        <BottomNav />
      </div>
    </div>
  );
}
