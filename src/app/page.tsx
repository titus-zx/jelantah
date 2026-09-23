"use client";
import { useRef, useState } from "react";

export default function JelantahForm() {
  // Controlled state
  const [nama, setNama] = useState("");
  const [hp, setHp] = useState("");
  const [berat, setBerat] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string>("");
  const [waktu, setWaktu] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");

  const fileInput = useRef<HTMLInputElement>(null);

  // Config — ganti URL di sini
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
    setWaktu(waktuSetor);

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
    <main className="min-h-screen p-4 flex flex-col items-center justify-center bg-yellow-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 w-full max-w-sm flex flex-col gap-4"
      >
        <h1 className="text-xl font-bold text-center text-yellow-700 mb-2">Setoran Jelantah GKJ Pamulang</h1>
        <label className="block">
          Nama:
          <input
            className="input input-bordered w-full mt-1"
            value={nama}
            onChange={e => setNama(e.target.value)}
            required
            placeholder="Nama Jemaat"
            autoComplete="name"
          />
        </label>
        <label className="block">
          Nomor HP:
          <input
            className="input input-bordered w-full mt-1"
            value={hp}
            onChange={e => setHp(e.target.value)}
            required
            placeholder="Nomor WA"
            autoComplete="tel"
            type="tel"
          />
        </label>
        <label className="block">
          Berat minyak (kg):
          <input
            className="input input-bordered w-full mt-1"
            type="number"
            value={berat}
            onChange={e => setBerat(e.target.value)}
            required
            step="any"
            min={0.1}
            placeholder="0.5"
          />
        </label>
        <label className="block">
          Foto timbang:
          <input
            ref={fileInput}
            className="file-input file-input-bordered w-full mt-1" 
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleChangeFoto}
            required
          />
        </label>
        {fotoUrl && (
          <div className="flex items-center justify-center">
            <img src={fotoUrl} alt="Preview" width={180} className="rounded border my-2" />
          </div>
        )}
        <button
          type="submit"
          className="btn btn-primary w-full disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Kirim Setoran"}
        </button>
        {ok && <p className="text-green-600 text-center">Tersimpan, terima kasih!</p>}
        {error && <p className="text-red-700 text-center">{error}</p>}
      </form>
      <p className="text-xs text-gray-400 mt-3 mb-1">Copyright &copy; GKJ Pamulang</p>
      <p className="text-xs text-gray-500">Powered by Google Apps Script + Google Sheet</p>
      <p className="text-xs text-gray-400">Edit <code>.env.local</code> → <b>NEXT_PUBLIC_APPS_SCRIPT_URL</b></p>
    </main>
  );
}
