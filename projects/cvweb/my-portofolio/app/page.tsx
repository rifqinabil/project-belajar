import KartuProfile from "@/komponen/kartuprofile";
import Portfolio from "@/komponen/portfolio";
import Skill from "@/komponen/skill";

export default function Home() {
  // Catatan pemula:
  // Layout global (background + container + navbar) sudah di-handle di app/layout.tsx
  // Jadi page ini cukup return kontennya saja.
  return (
    <>
      <KartuProfile
        nama="Muhammad Rifqi Nabil"
        deskripsi="Saya seorang antusias dalam bidang teknologi informasi dan pengembangan perangkat lunak serta lulusan S1 Sistem Informasi dari STT Terpadu Nurul Fikri."
      />

      <Portfolio />

      <Skill />
    </>
  );
}