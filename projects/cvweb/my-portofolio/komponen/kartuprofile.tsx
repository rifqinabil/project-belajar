"use client"; // menjalankan komponen ini di sisi klien sehingga Hooks (mis. useState) dapat digunakan
// Import React dan hook useState untuk menyimpan state lokal pada komponen
import React, { useState } from 'react';

// Definisi tipe untuk props komponen KartuProfile
type KartuProfileProps = {
    nama: string; // nama pengguna, ditampilkan sebagai judul
    deskripsi: string; // deskripsi awal yang bisa diubah oleh komponen
};

// Komponen KartuProfile menerima props dan menampilkan kartu profil sederhana
export default function KartuProfile({ nama, deskripsi }: KartuProfileProps) {
    // Inisialisasi state lokal 'desc' menggunakan nilai 'deskripsi' dari props
    const [desc, setDesc] = useState<string>(deskripsi);
    // State boolean untuk melacak apakah teks saat ini adalah versi awal
    const [isOriginal, setIsOriginal] = useState<boolean>(true);

    // Teks alternatif yang akan menggantikan deskripsi awal saat tombol diklik
    const alternateText = 'Saya ingin membangun karier di bidang IT support dan juga Full Stack Development';

    // Fungsi toggle: jika versi awal, ganti ke alternatif; jika sudah alternatif, kembalikan ke awal
    const toggleDesc = () => {
        if (isOriginal) {
            setDesc(alternateText);
            setIsOriginal(false);
        } else {
            setDesc(deskripsi); // kembalikan ke deskripsi awal dari props
            setIsOriginal(true);
        }
    };

    // JSX yang akan dirender: kartu dengan nama, deskripsi (dari state), dan tombol
    return (
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center"> {/* Kartu dengan latar abu-abu gelap, padding, sudut membulat, dan bayangan */}
            <h2 className="text-2xl font-semibold mb-4 text-white">{nama}</h2> {/* Judul nama dengan styling */}
            <p className="text-gray-300 mb-6">{desc}</p> {/* Deskripsi yang bersumber dari state 'desc' */}
            <button
                onClick={toggleDesc} // event handler toggle untuk mengubah/men-reset deskripsi
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
                Klik Saya {/* Label tombol */}
            </button>
        </div>
    );
}