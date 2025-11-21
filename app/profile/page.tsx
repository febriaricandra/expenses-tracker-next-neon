"use client";
import { User } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

export default function Profile() {
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ name: user?.name || "", password: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/profile")
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Gagal mengambil data profile");
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#181F2C] font-sans flex flex-col items-center">
      <div className="w-full max-w-sm px-6 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User size={32} color="#fff" />
          <h2 className="text-white text-lg font-semibold">Akun</h2>
        </div>
        <Image src="/monuvo.png" alt="Logo" width={48} height={48} />
      </div>
      <div className="w-full max-w-sm px-6 mt-10 flex flex-col items-center">
        {loading ? (
          <span className="text-white">Loading...</span>
        ) : error ? (
          <span className="text-red-400">{error}</span>
        ) : user ? (
          <div className="bg-gradient-to-br from-[#1B2A49] to-[#2E3A5A] rounded-xl p-8 flex flex-col items-center w-full">
            <User size={64} color="#fff" />
            <span className="text-white text-xl font-bold mt-4">{user.name}</span>
            <span className="text-white text-base mt-2">{user.email}</span>
            <span className="text-white text-xs mt-2">ID: {user.id}</span>
            <button onClick={handleLogout} className="mt-6 px-6 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition">Logout</button>
            <button onClick={() => setShowEdit(true)} className="mt-4 px-6 py-2 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition">Edit Profil</button>
          </div>
        ) : null}
      </div>
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#232B3E] rounded-xl p-6 w-[320px] flex flex-col gap-4">
            <h3 className="text-white text-base font-semibold mb-2">Edit Profil</h3>
            <input
              type="text"
              placeholder="Nama Baru"
              className="px-3 py-2 rounded bg-[#181F2C] text-white"
              value={editForm.name}
              onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
            />
            <input
              type="password"
              placeholder="Password Baru (opsional)"
              className="px-3 py-2 rounded bg-[#181F2C] text-white"
              value={editForm.password}
              onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))}
            />
            {editError && <span className="text-red-400 text-xs">{editError}</span>}
            {editSuccess && <span className="text-green-400 text-xs">{editSuccess}</span>}
            <div className="flex gap-2 mt-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                disabled={editLoading || !editForm.name}
                onClick={async () => {
                  setEditLoading(true);
                  setEditError("");
                  setEditSuccess("");
                  try {
                    const res = await fetch("/api/profile", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ name: editForm.name, password: editForm.password }),
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message);
                    setEditSuccess("Profil berhasil diupdate");
                    setShowEdit(false);
                    setUser(u => u ? { ...u, name: editForm.name } : u);
                  } catch (err: any) {
                    setEditError(err.message || "Gagal update profil");
                  }
                  setEditLoading(false);
                }}
              >Simpan</button>
              <button
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm"
                onClick={() => setShowEdit(false)}
              >Batal</button>
            </div>
          </div>
        </div>
      )}
      <div className="fixed bottom-0 left-0 w-full bg-[#232B3E] py-4 flex justify-center">
        <BottomNav />
      </div>
    </div>
  );
}
