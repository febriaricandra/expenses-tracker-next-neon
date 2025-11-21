"use client";

import BottomNav from "@/components/BottomNav";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function Homepage() {
	const [transactions, setTransactions] = useState<Array<any>>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [expenseSummary, setExpenseSummary] = useState<Array<any>>([]);

	useEffect(() => {
		fetch("/api/transaction?limit=10")
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
	}, []);

	useEffect(() => {
		fetch("/api/expense-summary")
			.then(async (res) => {
				if (!res.ok) throw new Error(await res.text());
				return res.json();
			})
			.then((data) => {
				setExpenseSummary(data.data);
			})
			.catch(() => {});
	}, []);

	return (
		<div className="min-h-screen bg-[#181F2C] font-sans flex flex-col items-center">
			{/* Header */}
			<div className="w-full max-w-sm px-6 pt-8 flex items-center justify-between">
				<div>
					<h2 className="text-white text-lg font-semibold">
						Halo, Monuvers!
					</h2>
				</div>
				<Image src="/monuvo.png" alt="Logo" width={48} height={48} />
			</div>
			{/* Chart */}
			<div className="w-full max-w-sm px-6 mt-6">
				<div className="bg-gradient-to-br from-[#1B2A49] to-[#2E3A5A] rounded-xl p-4">
					<h3 className="text-white text-sm mb-2">Kategori Pengeluaran</h3>
					{expenseSummary.length > 0 ? (
						<ResponsiveContainer width="100%" height={120}>
							<BarChart data={expenseSummary}>
								<CartesianGrid strokeDasharray="3 3" stroke="#2E3A5A" />
								<XAxis dataKey="category" tick={{ fill: '#fff', fontSize: 12 }} axisLine={false} />
								<YAxis tick={{ fill: '#fff', fontSize: 12 }} axisLine={false} />
								<Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')},00`} labelStyle={{ color: '#181F2C' }} contentStyle={{ background: '#fff', color: '#181F2C', borderRadius: 8 }} />
								<Bar dataKey="total" fill="#E57373" radius={[8,8,0,0]} />
							</BarChart>
						</ResponsiveContainer>
					) : (
						<div className="flex items-end gap-2 h-32">
							{/* Dummy chart */}
							<div className="bg-[#4FC3F7] w-8 h-24 rounded-t" />
							<div className="bg-[#81C784] w-8 h-20 rounded-t" />
							<div className="bg-[#FFD54F] w-8 h-12 rounded-t" />
							<div className="bg-[#E57373] w-8 h-8 rounded-t" />
							<div className="bg-[#BDBDBD] w-8 h-4 rounded-t" />
						</div>
					)}
					<div className="flex justify-between text-xs text-white mt-2">
						{expenseSummary.length > 0
							? expenseSummary.map((c) => <span key={c.category}>{c.category}</span>)
							: <>
									<span>Fes</span>
									<span>Mkn</span>
									<span>Trans</span>
									<span>Cafe</span>
									<span>Lain</span>
								</>}
					</div>
				</div>
			</div>
			{/* Menu Icons */}
			<div className="w-full max-w-sm px-6 mt-6 flex justify-between">
				<div className="flex gap-4 w-full justify-between">
					<Link href="/pemasukan" className="flex flex-col items-center">
						<Image src="/file.svg" alt="Pemasukan" width={32} height={32} />
						<span className="text-white text-xs mt-1">Pemasukan</span>
					</Link>
					<Link href="/pengeluaran" className="flex flex-col items-center">
						<Image src="/window.svg" alt="Pengeluaran" width={32} height={32} />
						<span className="text-white text-xs mt-1">Pengeluaran</span>
					</Link>
					<Link href="/penganggaran" className="flex flex-col items-center">
						<Image src="/globe.svg" alt="Penganggaran" width={32} height={32} />
						<span className="text-white text-xs mt-1">Penganggaran</span>
					</Link>
					<Link href="/tabungan" className="flex flex-col items-center">
						<Image src="/vercel.svg" alt="Tabungan" width={32} height={32} />
						<span className="text-white text-xs mt-1">Tabungan</span>
					</Link>
				</div>
			</div>
			{/* Transaksi */}
			<div className="w-full max-w-sm px-6 mt-8">
				<h3 className="text-white text-base font-semibold mb-4">Transaksi</h3>
				<div className="flex flex-col gap-4">
					{loading ? (
						<span className="text-white">Loading...</span>
					) : error ? (
						<span className="text-red-400">{error}</span>
					) : transactions.length === 0 ? (
						<span className="text-white">Belum ada transaksi</span>
					) : (
						transactions.map((tx, idx) => (
							<div
								key={tx.id || idx}
								className="bg-[#232B3E] rounded-xl p-4 flex flex-col gap-1"
							>
								<div className="flex justify-between items-center">
                  <span className={`text-white font-semibold ${tx.type === "expense" ? "text-red-400" : "text-green-400"}`}>{tx.title}</span>
                  <span className={`font-bold ${tx.type === "expense" ? "text-red-400" : "text-green-400"}`}>
                    {tx.type === "expense" ? "-" : "+"}Rp {Math.abs(tx.amount).toLocaleString("id-ID")},00
                  </span>
                </div>
								<span className="text-xs text-white/70">{tx.date}</span>
							</div>
						))
					)}
				</div>
			</div>
			{/* Bottom Navigation */}
			<BottomNav />
		</div>
	);
}
