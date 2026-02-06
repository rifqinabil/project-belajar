# Project Belajar

Kumpulan project **belajar & eksperimen** (ngoding iseng tapi serius). Repo ini sengaja dijadiin satu tempat biar progress kelihatan dan gampang di-cek ulang.

## Isi Repo
Semua project ada di folder:
- [`projects/`](./projects)

Project yang (sejauh ini) kelihatan jadi “core”:
- [`projects/auth-api/`](./projects/auth-api) — eksperimen API/auth (backend)
- [`projects/cvweb/`](./projects/cvweb) — eksperimen web/CV/portfolio (frontend)

## Cara Pakai Cepat
> Tiap folder project beda stack. Biasanya tinggal masuk folder project dan ikutin `README`/`package.json`/instruksi di dalamnya.

Contoh (kalau project-nya Node/Next):
```bash
cd projects/<nama-project>
npm install
npm run dev
```

## Catatan Penting (biar aman)
- File rahasia kayak `.env`, keys, dan file besar **di-ignore** lewat `.gitignore`.
- Kalau ada project yang butuh credential, bikin `.env` lokal masing-masing project (jangan dipush).

## Roadmap (biar repo makin mantap)
- [ ] Tambahin `README.md` per project: tujuan, fitur, cara run, screenshot.
- [ ] Rapihin penamaan folder + bikin daftar “highlight projects”.
- [ ] (Opsional) bikin halaman index portfolio (README + screenshot) biar recruiter langsung kebayang.
