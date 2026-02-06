// Komponen Portfolio / Projects
// Server component aman (tidak pakai hooks)

type Project = {
  judul: string;
  deskripsi: string;
  tech: string[];
  demoUrl?: string;
  githubUrl?: string;
};

const projects: Project[] = [
  {
    judul: "IT Support Ticket Logger (Mini)",
    deskripsi:
      "Catat tiket helpdesk: requester, device, category, priority, status, dan resolution. Ada search/filter + export CSV (via localStorage).",
    tech: ["Next.js", "React", "TypeScript", "localStorage"],
    demoUrl: "/itsupport",
    githubUrl: "",
  },
  {
    judul: "IT Support Asset Inventory (Mini)",
    deskripsi:
      "Catat aset IT: asset tag, lokasi, assigned user, status (in use/spare/repair) + export CSV untuk laporan.",
    tech: ["Next.js", "React", "TypeScript", "localStorage"],
    demoUrl: "/inventory",
    githubUrl: "",
  },
  {
    judul: "Todo App (Mini)",
    deskripsi:
      "Aplikasi todo sederhana: tambah task, filter (all/active/done), simpan otomatis ke localStorage.",
    tech: ["Next.js", "React", "TypeScript", "localStorage"],
    demoUrl: "/todo",
    githubUrl: "",
  },
  {
    judul: "CV Website (Next.js)",
    deskripsi:
      "Website CV/portofolio personal dengan Next.js + Tailwind untuk menampilkan profil, skill, dan proyek.",
    tech: ["Next.js", "React", "Tailwind", "TypeScript"],
    demoUrl: "/",
    githubUrl: "",
  },
  {
    judul: "Mini Sistem Dompet",
    deskripsi:
      "Aplikasi sederhana untuk pencatatan pemasukan/pengeluaran + laporan ringkas (CLI).",
    tech: ["Python"],
    demoUrl: "",
    githubUrl: "",
  },
  {
    judul: "Auth API (Basic)",
    deskripsi:
      "API autentikasi sederhana (login/register) untuk latihan backend.",
    tech: ["Node.js"],
    demoUrl: "",
    githubUrl: "",
  },
];

export default function Portfolio() {
  return (
    <section className="w-full max-w-5xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">
        Project & Portofolio
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <div
            key={p.judul}
            className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 shadow"
          >
            <h3 className="text-xl font-semibold text-white mb-2">{p.judul}</h3>
            <p className="text-gray-300 mb-4">{p.deskripsi}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {p.tech.map((t) => (
                <span
                  key={t}
                  className="bg-gray-700 text-gray-100 px-3 py-1 rounded-lg text-xs"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              {p.demoUrl ? (
                <a
                  href={p.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Demo
                </a>
              ) : (
                <span className="text-sm text-gray-500">Demo (belum)</span>
              )}

              {p.githubUrl ? (
                <a
                  href={p.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  GitHub
                </a>
              ) : (
                <span className="text-sm text-gray-500">GitHub (belum)</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-gray-400 text-sm mt-6 text-center">
        Catatan: beberapa project ini masih dalam tahap perkembangan.
      </p>
    </section>
  );
}
