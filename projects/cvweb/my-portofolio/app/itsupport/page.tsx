"use client"; // menjalankan komponen ini di sisi klien sehingga Hooks (mis. useState) dapat digunakan

import { useEffect, useMemo, useState } from "react"; // ini buat ngejalanin react

/**
 * Mini IT Support Ticket Logger
 * - Ini halaman demo (tanpa backend)
 * - Data disimpan di browser (localStorage)
 * - Tujuan: nunjukin skill IT Support (triage, prioritas, status, dokumentasi solusi)
 */

// Priority tiket (semakin tinggi = makin urgent)
type Priority = "Low" | "Medium" | "High";

// Status tiket (alur kerja standar helpdesk)
type TicketStatus = "Open" | "In Progress" | "Resolved";

// Bentuk data tiket yang kita simpan di state/localStorage
type Ticket = {
  id: string; // ID unik (buat key di React + identitas tiket)
  createdAt: string; // waktu dibuat (format ISO string)
  requester: string; // siapa yang request bantuan
  issue: string; // keluhan/masalah
  device?: string; // perangkat (opsional)
  category: string; // kategori issue (Software/Hardware/dll)
  priority: Priority; // prioritas
  status: TicketStatus; // status progress
  resolution?: string; // solusi (opsional)
};

// Key untuk localStorage (biar data tiket "keingat" walau refresh)
const STORAGE_KEY = "cvweb:itsupport:tickets:v1";

/**
 * Generate ID sederhana.
 * Catatan pemula: ini cukup untuk demo lokal, tapi bukan ID aman untuk sistem produksi.
 */
function uid() {
  return Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
}

// Filter status: bisa "All" atau salah satu status tiket
type StatusFilter = "All" | TicketStatus;

export default function ITSupportTicketLoggerPage() {
  /**
   * STATE: tickets
   * Kita pakai lazy initializer function supaya:
   * - tidak perlu setState di useEffect (lebih clean, lolos lint)
   * - hanya baca localStorage sekali saat komponen pertama kali dibuat
   */
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    // window cuma ada di browser. Di server (SSR) window itu undefined.
    if (typeof window === "undefined") return [];

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // Kalau belum ada data, balikin array kosong
      return raw ? (JSON.parse(raw) as Ticket[]) : [];
    } catch {
      // Kalau data corrupt / gagal parse, jangan crash
      return [];
    }
  });

  // STATE: filter (search text + status)
  const [filter, setFilter] = useState<{ q: string; status: StatusFilter }>({
    q: "",
    status: "All",
  });

  // STATE: input form (buat ticket baru)
  const [requester, setRequester] = useState("");
  const [issue, setIssue] = useState("");
  const [device, setDevice] = useState("");
  const [category, setCategory] = useState("Software");
  const [priority, setPriority] = useState<Priority>("Medium");

  /**
   * EFFECT: simpan tickets ke localStorage tiap kali tickets berubah.
   * Catatan pemula: useEffect dipakai buat sinkronisasi ke "sistem luar" (di sini: localStorage).
   */
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch {
      // ignore: kalau storage penuh / diblok browser, app tetap jalan
    }
  }, [tickets]);

  /**
   * DERIVED STATE: filtered
   * useMemo = cache hasil perhitungan supaya gak dihitung ulang kalau inputnya belum berubah.
   */
  const filtered = useMemo(() => {
    const q = filter.q.trim().toLowerCase();

    return tickets
      // Filter berdasarkan status
      .filter((t) => (filter.status === "All" ? true : t.status === filter.status))
      // Filter berdasarkan search keyword
      .filter((t) => {
        if (!q) return true;
        return (
          t.requester.toLowerCase().includes(q) ||
          t.issue.toLowerCase().includes(q) ||
          (t.device || "").toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
        );
      })
      // Urutkan yang paling baru di atas
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [tickets, filter]);

  /**
   * ACTION: tambah tiket
   * Catatan pemula: setTickets((prev)=>...) aman karena pakai state terbaru.
   */
  function addTicket() {
    // Validasi minimal (wajib diisi)
    if (!requester.trim() || !issue.trim()) return;

    const t: Ticket = {
      id: uid(),
      createdAt: new Date().toISOString(),
      requester: requester.trim(),
      issue: issue.trim(),
      device: device.trim() || undefined,
      category,
      priority,
      status: "Open",
    };

    setTickets((prev) => [t, ...prev]);

    // Reset sebagian field biar cepat input ticket berikutnya
    setIssue("");
    setDevice("");
  }

  /**
   * ACTION: update tiket (misal ganti status / isi resolution)
   * patch = data yang mau diganti aja.
   */
  function updateTicket(id: string, patch: Partial<Ticket>) {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  // ACTION: hapus tiket
  function removeTicket(id: string) {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  }

  // =========================
  // EXPORT CSV (Fitur A)
  // ============
  /**
   * CSV itu sensitif: kalau ada koma/newline/tanda kutip, harus di-escape.
   * Aturan umum CSV:
   * - kalau ada karakter spesial, bungkus field dengan tanda kutip ("...")
   * - kalau field mengandung ", maka jadi "" (double quote)
   */
  function csvEscape(v: string) {
    const s = v ?? "";
    const escaped = s.replace(/"/g, '""');
    return /[",\n\r]/.test(s) ? `"${escaped}"` : escaped;
  }

  // Convert array tickets → string CSV
  function ticketsToCsv(rows: Ticket[]) {
    const header = [
      "id",
      "createdAt",
      "requester",
      "issue",
      "device",
      "category",
      "priority",
      "status",
      "resolution",
    ];

    const lines = rows.map((t) =>
      [
        t.id,
        t.createdAt,
        t.requester,
        t.issue,
        t.device || "",
        t.category,
        t.priority,
        t.status,
        t.resolution || "",
      ]
        .map(csvEscape)
        .join(",")
    );

    return [header.join(","), ...lines].join("\n");
  }

  /**
   * Download file di browser tanpa backend.
   * Tekniknya:
   * 1) bikin Blob
   * 2) bikin URL sementara
   * 3) bikin <a download>
   * 4) klik secara programatik
   */
  function downloadTextFile(filename: string, content: string, mime: string) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    // bersihin URL sementara biar gak bocor memory
    URL.revokeObjectURL(url);
  }

  // Tombol export akan manggil ini
  function exportCsv(rows: Ticket[]) {
    // BOM (\ufeff) biar Excel Windows kebaca UTF-8 (biasanya kalau gak ada, teks bisa aneh)
    const csv = "\ufeff" + ticketsToCsv(rows);
    const date = new Date().toISOString().slice(0, 10);

    downloadTextFile(`it-support-tickets-${date}.csv`, csv, "text/csv;charset=utf-8;");
  }

  return (
    <>
        <header className="text-center">
          <h1 className="text-3xl font-bold">IT Support Ticket Logger</h1>
          <p className="text-gray-300 mt-2">
            Mini project: catat tiket, status, prioritas, dan solusi. Disimpan di browser (localStorage).
          </p>
        </header>

        <section className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Buat Ticket Baru</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300">Requester *</label>
              <input
                value={requester}
                onChange={(e) => setRequester(e.target.value)}
                className="mt-1 w-full rounded bg-gray-800 border border-gray-700 px-3 py-2"
                placeholder="Nama user / divisi"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Device (opsional)</label>
              <input
                value={device}
                onChange={(e) => setDevice(e.target.value)}
                className="mt-1 w-full rounded bg-gray-800 border border-gray-700 px-3 py-2"
                placeholder="PC-02 / Laptop / Printer"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-300">Issue *</label>
              <textarea
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                className="mt-1 w-full rounded bg-gray-800 border border-gray-700 px-3 py-2 min-h-24"
                placeholder="Contoh: Outlook tidak bisa login, muncul error ..."
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded bg-gray-800 border border-gray-700 px-3 py-2"
              >
                <option>Software</option>
                <option>Hardware</option>
                <option>Network</option>
                <option>Account</option>
                <option>Printer</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-300">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="mt-1 w-full rounded bg-gray-800 border border-gray-700 px-3 py-2"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={addTicket}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              Add Ticket
            </button>
            <span className="text-sm text-gray-400">* wajib diisi</span>
          </div>
        </section>

        <section className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold">Daftar Ticket</h2>

            {/* Filter & Export controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={filter.q}
                onChange={(e) => setFilter((f) => ({ ...f, q: e.target.value }))}
                className="rounded bg-gray-800 border border-gray-700 px-3 py-2"
                placeholder="Cari (nama/issue/device/category)"
              />

              <select
                value={filter.status}
                onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value as StatusFilter }))}
                className="rounded bg-gray-800 border border-gray-700 px-3 py-2"
              >
                <option value="All">All</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              {/* Export mengikuti filter + search yang aktif (pakai `filtered`) */}
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
            <p className="text-gray-400">Belum ada ticket. Bikin satu dulu.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filtered.map((t) => (
                <div key={t.id} className="border border-gray-800 rounded-lg p-4 bg-gray-950/40">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                      <div className="text-sm text-gray-400">{new Date(t.createdAt).toLocaleString()}</div>
                      <div className="text-lg font-semibold">{t.requester}</div>
                      <div className="text-gray-200 mt-1 whitespace-pre-wrap">{t.issue}</div>
                      {t.device ? <div className="text-sm text-gray-300 mt-2">Device: {t.device}</div> : null}

                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-xs bg-gray-800 px-2 py-1 rounded">{t.category}</span>
                        <span className="text-xs bg-gray-800 px-2 py-1 rounded">Priority: {t.priority}</span>
                        <span className="text-xs bg-gray-800 px-2 py-1 rounded">Status: {t.status}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-48">
                      {/* Dropdown buat update status */}
                      <select
                        value={t.status}
                        onChange={(e) => updateTicket(t.id, { status: e.target.value as TicketStatus })}
                        className="rounded bg-gray-800 border border-gray-700 px-3 py-2"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>

                      {/* Field dokumentasi solusi (penting buat IT Support) */}
                      <textarea
                        value={t.resolution || ""}
                        onChange={(e) => updateTicket(t.id, { resolution: e.target.value })}
                        className="rounded bg-gray-800 border border-gray-700 px-3 py-2 min-h-20"
                        placeholder="Resolution/solusi (opsional)"
                      />

                      <button
                        onClick={() => removeTicket(t.id)}
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
            Catatan: ini demo lokal (data disimpan di browser). Untuk versi “real”, kita bisa sambungin ke database +
            login.
          </p>
        </section>
    </>
  );
}
