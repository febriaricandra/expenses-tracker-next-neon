'use client'

import React, { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal daftar");
      setSuccess("Registrasi berhasil!");
      setForm({ name: "", email: "", password: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1833]">
      <div className="w-full max-w-xs p-6 rounded-2xl bg-[#11224d] shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <img src="/monuvo.png" alt="Monuvo Logo" className="w-100" />
          <h1 className="text-2xl font-bold text-white mb-1">Buat Akun Baru?</h1>
          <p className="text-xs text-gray-300">Sudah Memiliki Akun? <a href="/login" className="underline">Masuk di sini.</a></p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-300 mb-1">NAMA</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-[#1e5fa3] to-[#2bb3c0] text-white placeholder-gray-200 focus:outline-none"
              placeholder="Monuvers"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-300 mb-1">EMAIL</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-[#1e5fa3] to-[#2bb3c0] text-white placeholder-gray-200 focus:outline-none"
              placeholder="monuvers@gmail.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-300 mb-1">KATA SANDI</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-[#1e5fa3] to-[#2bb3c0] text-white placeholder-gray-200 focus:outline-none"
              placeholder="******"
              required
            />
          </div>
          {error && <div className="text-red-400 text-xs">{error}</div>}
          {success && <div className="text-green-400 text-xs">{success}</div>}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-[#071a13] text-white font-semibold mt-2 hover:bg-[#0c2c1e] transition"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>
      </div>
    </div>
  );
}
