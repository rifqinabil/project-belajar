"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * IT Support Asset Inventory (Mini)
 * Tujuan:
 * - nunjukin kemampuan dokumentasi & pencatatan aset
 * - basic CRUD (create/read/update/delete)
 * - export CSV (buat laporan ke admin/atasan)
 *
 * Catatan pemula:
 * - Ini masih demo lokal: datanya disimpan di browser (localStorage)
 * - Kalau mau versi "real": sambungin ke database + auth
 */

// Kondisi aset yang umum di dunia IT support
type AssetStatus = "In Use" | "Spare" | "Repair" | "Retired";

type Asset = {
  id: string;
  createdAt: string; // ISO string
  assetTag: string; // contoh: IT-001
  name: string; // contoh: Lenovo ThinkPad T14
  type: string; // contoh: Laptop/PC/Printer/Router
  location: string; // contoh: Office Lt.2 / Gudang
  assignedTo?: string; // user yang pegang (opsional)
  status: AssetStatus;
  notes?: string;
};

const STORAGE_KEY = "cvweb:itsupport:inventory:v1";

function uid() {
  return Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
}

type StatusFilter = "All" | AssetStatus;

export default function InventoryPage() {
  // Load awal dari localStorage (sekali saja) — lebih baik daripada setState di useEffect
  const [assets, setAssets] = useState<Asset[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Asset[]) : [];
    } catch {
      return [];
    }
  });

  // Simpan setiap kali assets berubah
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
    } catch {
      // ignore
    }
  }, [assets]);

  // Filter/search state
  const [filter, setFilter] = useState<{ q: string; status: StatusFilter }>({
    q: "",
    status: "All",
  });

  // Form state (buat tambah aset)
  const [assetTag, setAssetTag] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("Laptop");
  const [location, setLocation] = useState("Office");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState<AssetStatus>("In Use");
  const [notes, setNotes] = useState("");

  // Hasil assets yang udah difilter + diurutkan
  const filtered = useMemo(() => {
    const q = filter.q.trim().toLowerCase();

    return assets
      .filter((a) => (filter.status === "All" ? true : a.status === filter.status))
      .filter((a) => {
        if (!q) return true;
        return (
          a.assetTag.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q) ||
          (a.assignedTo || "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [assets, filter]);

  // ===== CRUD =====

  function addAsset() {
    // Validasi minimal
    if (!assetTag.trim() || !name.trim()) return;

    const a: Asset = {
      id: uid(),
      createdAt: new Date().toISOString(),
      assetTag: assetTag.trim(),
      name: name.trim(),
      type,
      location,
      assignedTo: assignedTo.trim() || undefined,
      status,
      notes: notes.trim() || undefined,
    };

    setAssets((prev) => [a, ...prev]);

    // reset field biar gampang input berikutnya
    setAssetTag("");
    setName("");
    setAssignedTo("");
    setNotes("");
  }

  function updateAsset(id: string, patch: Partial<Asset>) {
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }

  function removeAsset(id: string) {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  }

  // ===== Export CSV =====

  function csvEscape(v: string) {
    const s = v ?? "";
    const escaped = s.replace(/"/g, '""');
    return /[",\n\r]/.test(s) ? `"${escaped}"` : escaped;
  }

  function assetsToCsv(rows: Asset[]) {
    const header = [
      "id",
      "createdAt",
      "assetTag",
      "name",
      "type",
      "location",
      "assignedTo",
      "status",
      "notes",
    ];

    const lines = rows.map((a) =>
      [
        a.id,
        a.createdAt,
        a.assetTag,
        a.name,
        a.type,
        a.location,
        a.assignedTo || "",
        a.status,
        a.notes || "",
      ]
        .map(csvEscape)
        .join(",")
    );

    return [header.join(","), ...lines].join("\n");
  }

  function downloadTextFile(filename: string, content: string, mime: string) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }

  function exportCsv(rows: Asset[]) {
    const csv = "\ufeff" + assetsToCsv(rows);
    const date = new Date().toISOString().slice(0, 10);
    downloadTextFile(`it-inventory-${date}.csv`, csv, "text/csv;charset=utf-8;");
  }

  return (
    <>
      <header className="text-center">
        <h1 className="text-3xl font-bold">IT Support Asset Inventory</h1>
        <p className="text-gray-300 mt-2">
          Mini project: catat aset (asset tag, lokasi, user pemegang, status) + export CSV.
        </p>
      </header>

      {/* Form tambah aset */}
      <section className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Tambah Aset</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-300">Asset Tag *</label>
            <input
              value={assetTag}
              onChange={(e) => setAssetTag(e.target.value)}
              className="mt-1 w-full rounded bg-gray-800 border border-gray-700 px-3 py-2"
              placeholder="IT-001"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Nama Perangkat *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded bg-gray-800 border border-gray-700 px-3 py-2"
              placeholder="Lenovo ThinkPad T14"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 w-full rounded bg-gray-800 border border-gray-700 px-3 py-2"
            >
              <option>Laptop</option>
              <option>PC</option>
              <option>Printer</option>
              <option>Router</option>
              <option>Switch</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-300">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 w-full rounded bg-gray-800 border border-gray-700 px-3 py-2"
              placeholder="Office Lt.2 / Gudang"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Assigned To (opsional)</label>
            <input
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="mt-1 w-full rounded bg-gray-800 border border-gray-700 px-3 py-2"
              placeholder="Nama user / divisi"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AssetStatus)}
              className="mt-1 w-full rounded bg-gray-800 border border-gray-700 px-3 py-2"
            >
              <option value="In Use">In Use</option>
              <option value="Spare">Spare</option>
              <option value="Repair">Repair</option>
              <option value="Retired">Retired</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-300">Notes (opsional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full rounded bg-gray-800 border border-gray-700 px-3 py-2 min-h-20"
              placeholder="Contoh: sudah install Office, kondisi baterai 80%, dll"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={addAsset}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            Add Asset
          </button>
          <span className="text-sm text-gray-400">* wajib diisi</span>
        </div>
      </section>

      {/* List aset + filter + export */}
      <section className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold">Daftar Aset</h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={filter.q}
              onChange={(e) => setFilter((f) => ({ ...f, q: e.target.value }))}
              className="rounded bg-gray-800 border border-gray-700 px-3 py-2"
              placeholder="Cari (tag/nama/type/lokasi/user)"
            />

            <select
              value={filter.status}
              onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value as StatusFilter }))}
              className="rounded bg-gray-800 border border-gray-700 px-3 py-2"
            >
              <option value="All">All</option>
              <option value="In Use">In Use</option>
              <option value="Spare">Spare</option>
              <option value="Repair">Repair</option>
              <option value="Retired">Retired</option>
            </select>

            <button
              onClick={() => exportCsv(filtered)}
              disabled={filtered.length === 0}
              title="Export sesuai filter & search yang aktif"
              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-400 text-white font-semibold py-2 px-4 rounded"
            >
              Export CSV ({filtered.length})
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-400">Belum ada aset. Tambah dulu.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((a) => (
              <div key={a.id} className="border border-gray-800 rounded-lg p-4 bg-gray-950/40">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-400">{new Date(a.createdAt).toLocaleString()}</div>
                    <div className="text-lg font-semibold">
                      {a.assetTag} — {a.name}
                    </div>
                    <div className="text-sm text-gray-300 mt-1">
                      Type: {a.type} • Location: {a.location}
                      {a.assignedTo ? ` • Assigned: ${a.assignedTo}` : ""}
                    </div>
                    {a.notes ? <div className="text-gray-200 mt-2 whitespace-pre-wrap">{a.notes}</div> : null}

                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs bg-gray-800 px-2 py-1 rounded">Status: {a.status}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-56">
                    <select
                      value={a.status}
                      onChange={(e) => updateAsset(a.id, { status: e.target.value as AssetStatus })}
                      className="rounded bg-gray-800 border border-gray-700 px-3 py-2"
                    >
                      <option value="In Use">In Use</option>
                      <option value="Spare">Spare</option>
                      <option value="Repair">Repair</option>
                      <option value="Retired">Retired</option>
                    </select>

                    <input
                      value={a.location}
                      onChange={(e) => updateAsset(a.id, { location: e.target.value })}
                      className="rounded bg-gray-800 border border-gray-700 px-3 py-2"
                      placeholder="Update lokasi"
                    />

                    <input
                      value={a.assignedTo || ""}
                      onChange={(e) => updateAsset(a.id, { assignedTo: e.target.value || undefined })}
                      className="rounded bg-gray-800 border border-gray-700 px-3 py-2"
                      placeholder="Update assigned to"
                    />

                    <button
                      onClick={() => removeAsset(a.id)}
                      className="text-sm text-red-300 hover:text-red-200 self-start"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-500 mt-4">
          Catatan: ini demo lokal (data disimpan di browser). Untuk versi “real”, bisa pakai database + role akses.
        </p>
      </section>
    </>
  );
}
