import Link from "next/link";

/**
 * Navbar sederhana buat navigasi antar halaman demo.
 * Catatan pemula:
 * - Komponen ini "server component" (default) karena gak pakai state/hook.
 * - next/link bikin navigasi cepat (client-side) di Next.js.
 */
export default function Navbar() {
  return (
    <nav className="w-full mb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-lg font-semibold">Rifqi Nabil — Portofolio</div>
          <div className="text-sm text-gray-400">IT Support • Web • Automation</div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <Link className="text-blue-300 hover:text-blue-200" href="/">
            Home
          </Link>
          <Link className="text-blue-300 hover:text-blue-200" href="/itsupport">
            Ticket Logger
          </Link>
          <Link className="text-blue-300 hover:text-blue-200" href="/inventory">
            Inventory
          </Link>
          <Link className="text-blue-300 hover:text-blue-200" href="/todo">
            Todo App
          </Link>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-800" />
    </nav>
  );
}
