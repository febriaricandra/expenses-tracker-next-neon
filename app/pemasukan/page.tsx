"use client";

import Image from "next/image";
import BottomNav from "../../components/BottomNav";
import { useEffect, useState } from "react";

export default function Pemasukan() {
	const [transactions, setTransactions] = useState<Array<any>>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [form, setForm] = useState({ title: "", amount: "", date: "", category: "", description: "" });
	const [formLoading, setFormLoading] = useState(false);
	const [formError, setFormError] = useState("");
	const [categories, setCategories] = useState<Array<any>>([]);

	const fetchTransactions = () => {
		setLoading(true);
		fetch("/api/transaction?type=income")
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
					type: "income",
				}),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Gagal tambah transaksi");
			setShowModal(false);
			setForm({ title: "", amount: "", date: "", category: "", description: "" });
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
					<Image src="/file.svg" alt="Pemasukan" width={32} height={32} />
					<h2 className="text-white text-lg font-semibold">Pemasukan</h2>
				</div>
				<Image src="/monuvo.png" alt="Logo" width={48} height={48} />
			</div>
			<div className="w-full max-w-sm px-6 mt-6">
				<div className="bg-gradient-to-br from-[#1B2A49] to-[#2E3A5A] rounded-xl p-4 text-center">
					<span className="text-white text-lg font-semibold">Rp {transactions.reduce((acc, tx) => acc + tx.amount, 0).toLocaleString("id-ID")},00</span>
				</div>
			</div>
			<div className="w-full max-w-sm px-6 mt-8">
				<h3 className="text-white text-base font-semibold mb-4">Transaksi</h3>
				<button className="w-full mb-4 rounded-full px-4 py-2 bg-green-600 text-white font-semibold" onClick={() => setShowModal(true)}>
					+ Tambah Transaksi
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
									<span className="font-bold text-green-400">+Rp {tx.amount.toLocaleString("id-ID")},00</span>
								</div>
								<span className="text-xs text-white/70">{tx.date}</span>
								<span className="text-xs text-white/60">{tx.category} - {tx.description}</span>
							</div>
						))
					)}
				</div>
			</div>
			{/* Modal Tambah Transaksi */}
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
					<div className="bg-[#232B3E] rounded-2xl p-6 w-full max-w-xs flex flex-col">
						<h3 className="text-white text-lg font-semibold mb-4">Tambah Pemasukan</h3>
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
