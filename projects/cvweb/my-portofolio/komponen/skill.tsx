// Komponen daftar keahlian
export default function Skill() {
    // Array berisi semua skill, lebih mudah dikelola daripada menulis ulang JSX untuk setiap item
    const skills = [
        'Troubleshooting hardware & software',
        'Instalasi Windows & aplikasi kerja',
        'Penanganan masalah printer (install, koneksi, hasil cetak)',
        'Helpdesk / dukungan teknis pengguna',
        'Support on-site (lapangan)',
        'Dokumentasi masalah & solusi',
        'Basic maintenance perangkat',
        'Konfigurasi jaringan dasar (LAN & WiFi)',
        'Paham IP address & konektivitas',
        'Troubleshooting koneksi internet',
        'Dasar penggunaan router/switch',
        'Windows OS (install, setting, troubleshooting)',
        'Linux dasar (command & pemahaman sistem)',
        'Microsoft Office (Word, Excel, dll)',
        'Basic system setup untuk user',
        'HTML',
        'CSS',
        'Python',
        'Next.js',
        'MySQL',
        'Dasar digital marketing',
        'Pengelolaan platform digital',
        'Pemahaman sistem berbasis web',
        'Online Ads'
    ];

    return (
        // Section berisi area keahlian dengan latar gelap dan teks putih
        <section className="bg-gray-900 text-white py-12">
            {/* Kontainer agar konten tidak melebar ke pinggir layar */}
            <div className="max-w-4xl mx-auto px-4">
                {/* Judul section */}
                <h2 className="text-3xl font-bold mb-8 text-center">Keahlian Saya</h2>

                {/* Gunakan elemen ul/li untuk semantik dan aksesibilitas */}
                <ul className="flex flex-wrap justify-center gap-4"> {/* flex-wrap (bukan flex-warp) untuk membungkus item */}
                    {skills.map((skill) => (
                        <li key={skill} className="bg-gray-700 px-4 py-2 rounded-lg text-sm"> {/* py-2 (bukan py2) */}
                            {skill}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}