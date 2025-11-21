"use client";
import BottomNav from "@/components/BottomNav";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Tabungan() {
  const [savings, setSavings] = useState<Array<{ id: string; bank: string; amount: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ bank: "", accountNumber: "", amount: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchSavings = () => {
    setLoading(true);
    fetch("/api/savings")
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        setSavings(data.savings);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Gagal mengambil data tabungan");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSavings();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    try {
      const res = await fetch("/api/savings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bank: form.bank,
          accountNumber: form.accountNumber,
          amount: Number(form.amount),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal tambah tabungan");
      setShowModal(false);
      setForm({ bank: "", accountNumber: "", amount: "" });
      fetchSavings();
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
          <Image src="/vercel.svg" alt="Tabungan" width={32} height={32} />
          <h2 className="text-white text-lg font-semibold">Tabungan</h2>
        </div>
        <Image src="/monuvo.png" alt="Logo" width={48} height={48} />
      </div>
      <div className="w-full max-w-sm px-6 mt-6 flex flex-col gap-4">
        {loading ? (
          <span className="text-white">Loading...</span>
        ) : error ? (
          <span className="text-red-400">{error}</span>
        ) : savings.length === 0 ? (
          <span className="text-white">Belum ada data tabungan</span>
        ) : (
          savings.map((s, idx) => (
            <div key={s.id || idx} className="bg-gradient-to-br from-[#1B2A49] to-[#2E3A5A] rounded-xl p-4 flex flex-col">
              <span className="text-white text-lg font-semibold">{s.bank}</span>
              <span className="text-white text-sm">Saldo</span>
              <span className="text-white text-xl font-bold">Rp {s.amount.toLocaleString("id-ID")}</span>
            </div>
          ))
        )}
        <div className="flex justify-center mt-2">
          <button className="bg-[#232B3E] rounded-full w-14 h-14 flex items-center justify-center" onClick={() => setShowModal(true)}>
            <span className="text-white text-3xl font-bold">+</span>
          </button>
        </div>
      </div>
      {/* Modal Tambah Tabungan */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#232B3E] rounded-2xl p-6 w-full max-w-xs flex flex-col">
            <h3 className="text-white text-lg font-semibold mb-4">Tambah Tabungan</h3>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
              <input
                name="bank"
                value={form.bank}
                onChange={handleFormChange}
                className="rounded-lg px-4 py-2 bg-[#181F2C] text-white placeholder:text-white/60"
                placeholder="Nama Bank/E-Wallet"
                required
              />
              <input
                name="accountNumber"
                value={form.accountNumber}
                onChange={handleFormChange}
                className="rounded-lg px-4 py-2 bg-[#181F2C] text-white placeholder:text-white/60"
                placeholder="No. Rekening/ID (opsional)"
              />
              <input
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleFormChange}
                className="rounded-lg px-4 py-2 bg-[#181F2C] text-white placeholder:text-white/60"
                placeholder="Saldo Awal"
                required
              />
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
