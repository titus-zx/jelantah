"use client";
import { useRef, useState } from "react";

export default function JelantahForm() {
  const [nama, setNama] = useState("");
  const [hp, setHp] = useState("");
  const [berat, setBerat] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");

  const fileInput = useRef<HTMLInputElement>(null);

  const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || "";

  function handleChangeFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
      setFotoUrl(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOk(false);
    setError("");
    if (!foto) return setError("Foto timbang wajib");
    if (!berat) return setError("Input jumlah berat");
    const waktuSetor = new Date().toISOString();
    const data = new FormData();
    data.append("nama", nama);
    data.append("hp", hp);
    data.append("berat", berat);
    data.append("waktu", waktuSetor);
    data.append("foto", foto);
    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error("Gagal submit: " + res.status);
      setOk(true);
      setNama(""); setHp(""); setBerat(""); setFoto(null); setFotoUrl("");
    } catch (e: any) {
      setError(e?.message || "Error tidak diketahui");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-amber-50 px-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md flex flex-col gap-5 border border-amber-200"
        style={{ boxShadow: "0 4px 24px 0 #ffd58d33" }}
      >
        <h1 className="text-2xl font-extrabold text-amber-700 text-center tracking-tight mb-2 drop-shadow-sm">
          Setoran Jelantah GKJ Pamulang
        </h1>
        <label className="block text-amber-800 font-semibold">
          Nama
          <input
            className="mt-1 block w-full px-3 py-2 border border-amber-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-base bg-white placeholder-amber-300 text-amber-900 font-normal"
            value={nama}
            onChange={e => setNama(e.target.value)}
            required
            placeholder="Nama Jemaat"
            autoComplete="name"
            maxLength={50}
          />
        </label>
        <label className="block text-amber-800 font-semibold">
          Nomor HP
          <input
            className="mt-1 block w-full px-3 py-2 border border-amber-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-base bg-white placeholder-amber-300 text-amber-900 font-normal"
            value={hp}
            onChange={e => setHp(e.target.value)}
            required
            placeholder="Nomor WA"
            autoComplete="tel"
            type="tel"
            maxLength={20}
          />
        </label>
        <label className="block text-amber-800 font-semibold">
          Berat minyak (kg)
          <input
            className="mt-1 block w-full px-3 py-2 border border-amber-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-base bg-white placeholder-amber-300 text-amber-900 font-normal"
            value={berat}
            type="number"
            onChange={e => setBerat(e.target.value)}
            required
            placeholder="Contoh: 1.25"
            step="any"
            min={0.1}
            max={100}
          />
        </label>
        <div>
          <div className="text-amber-800 font-semibold mb-1">Foto timbang</div>
          <label className="block w-full">
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleChangeFoto}
              required
            />
            <button type="button" className="w-full mb-1 px-4 py-3 rounded-xl bg-amber-100 border border-amber-300 text-amber-700 font-medium shadow hover:bg-amber-200 focus:ring-2 focus:ring-amber-300" onClick={() => fileInput.current?.click()}>
              {foto ? "Ulang Foto" : "Ambil / Pilih Foto Timbang"}
            </button>
          </label>
          {fotoUrl && (
            <div className="flex items-center justify-center">
              <img src={fotoUrl} alt="Preview" className="rounded-lg border border-amber-300 shadow my-2 max-h-48" />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full mt-3 bg-amber-400 hover:bg-amber-500 text-white font-bold px-4 py-3 rounded-xl shadow-sm transition active:bg-amber-600 disabled:opacity-60 text-lg"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Kirim Setoran"}
        </button>
        {ok && <p className="text-green-700 text-center font-semibold">Tersimpan, terima kasih!</p>}
        {error && <p className="text-red-700 text-center font-semibold">{error}</p>}
        <div className="text-xs text-gray-400 text-center mt-3 mb-1">Copyright &copy; GKJ Pamulang</div>
        <div className="text-xs text-gray-400 text-center">Powered by Google Apps Script + Google Sheet</div>
        <div className="text-xs text-amber-300 text-center">Edit <code>.env.local</code> &rarr; <b>NEXT_PUBLIC_APPS_SCRIPT_URL</b></div>
      </form>
    </main>
  );
}
