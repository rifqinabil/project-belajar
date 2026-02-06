# Project Belajar

Repo ini gue pakai buat **belajar** dan **membiasakan diri ngoding** secara konsisten. Isinya campuran project kecil, eksperimen, dan latihan — tujuannya biar skill naik pelan-pelan tapi nyata (ada jejak commit + hasil).

## Isi Repo
Semua project ada di folder:
- [`projects/`](./projects)

Project yang (sejauh ini) kelihatan jadi “core”:
- [`projects/auth-api/`](./projects/auth-api) — eksperimen API/auth (backend)
- [`projects/cvweb/`](./projects/cvweb) — eksperimen web/CV/portfolio (frontend)

## Cara Jalanin (Quick Start)
Karena ini repo kumpulan, tiap project bisa beda stack. Tapi pola umumnya gini:

1) Masuk ke folder project
```bash
cd projects/<nama-project>
```

2) Baca instruksi project
- Cek `README.md` di folder project (kalau ada)
- Kalau belum ada README, minimal cek `package.json` / `requirements.txt` / `pyproject.toml`

### Kalau project-nya Node / Next.js
```bash
npm install
npm run dev
```

### Kalau project-nya Python
```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Troubleshooting cepat
- Kalau error dependency: hapus `node_modules` (kalau ada) lalu `npm install` ulang
- Pastikan versi Node/Python sesuai (kadang project lama beda versi)

## Catatan Penting (biar aman)
- File rahasia kayak `.env`, keys, dan file besar **di-ignore** lewat `.gitignore`.
- Kalau ada project yang butuh credential, bikin `.env` lokal masing-masing project (jangan dipush).

## Roadmap (biar repo makin mantap)
- [ ] Tambahin `README.md` per project: tujuan, fitur, cara run, screenshot.
- [ ] Rapihin penamaan folder + bikin daftar “highlight projects”.
- [ ] (Opsional) bikin halaman index portfolio (README + screenshot) biar recruiter langsung kebayang.
