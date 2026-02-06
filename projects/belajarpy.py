barang = {
    "gula": 2000,
    "tepung": 1500,
    "telur": 2500,
    "mentega": 3000,
}

while True:
    print("\nDaftar Perintah:")
    print("-------------------")
    print("1. tambah Barang dan harga")
    print("2. lihat Barang") 
    print("3. total harga")
    print("4. hapus Barang")
    print("5. transaksi")
    print("6. keluar")

    perintah = input("\nMasukkan perintah 1-6: ").lower()

    if perintah == "1" or perintah == "tambah barang dan harga":
        while True:
            nama_barang = input("Masukkan nama barang: ").lower()
            harga_barang = int(input("Masukkan harga barang: "))
            barang[nama_barang] = harga_barang
            print(f"Barang '{nama_barang}' dengan harga {harga_barang} telah ditambahkan.")
            sudah = input("Apakah Anda ingin menambahkan barang lain? (ya/tidak): ").lower()
            if sudah != "ya":
                break
    

    elif perintah == "2" or perintah == "lihat barang":
        print("\nDaftar Barang dan Harga:")
        for i, (nama, harga) in enumerate(barang.items(), start=1):
            print(f"{i}. {nama.capitalize()}: Rp{harga}")

    elif perintah == "3" or perintah == "total harga":
        total_harga = sum(barang.values())
        print(f"\nTotal harga semua barang: Rp{total_harga}")
        
    elif perintah == "4" or perintah == "hapus barang":
        while True:
            nama_barang = input("Masukkan nama barang yang ingin dihapus: ").lower()
            if nama_barang in barang:
                del barang[nama_barang]
                print(f"Barang '{nama_barang}' telah dihapus.")
            else:
                print(f"Barang '{nama_barang}' tidak ditemukan.")
            sudah = input("Apakah Anda ingin menghapus barang lain? (ya/tidak): ").lower()
            if sudah != "ya":
                break

    elif perintah == "5" or perintah == "transaksi":
        class Transaksi:
            def __init__(self, barang):
                self.barang = barang

            def proses_transaksi(self):
                # Tampilkan daftar barang bernomor
                nama_list = list(self.barang.keys())
                print("\nDaftar Barang:")
                for idx, nama in enumerate(nama_list, start=1):
                    print(f"{idx}. {nama}: Rp{self.barang[nama]}")

                daftar_beli = []
                while True:
                    pilih = input("Masukkan nomor atau nama barang yang ingin dibeli (atau ketik 'selesai'): ").strip().lower()
                    if pilih == 'selesai':
                        break
                    # Jika input angka, map ke nama
                    if pilih.isdigit():
                        idx = int(pilih) - 1
                        if 0 <= idx < len(nama_list):
                            nama_dipilih = nama_list[idx]
                            daftar_beli.append(nama_dipilih)
                            print(f"'{nama_dipilih}' ditambahkan ke keranjang.")
                            while True:
                                jumlah = input(f"Berapa banyak '{nama_dipilih}' yang ingin dibeli? ")
                                if jumlah.isdigit() and int(jumlah) > 0:
                                    for _ in range(int(jumlah) - 1):
                                        daftar_beli.append(nama_dipilih)
                                    break
                        else:
                            print("Nomor tidak valid.")
                    else:
                        if pilih in self.barang:
                            daftar_beli.append(pilih)
                            print(f"'{pilih}' ditambahkan ke keranjang.")
                        else:
                            print(f"Barang '{pilih}' tidak ditemukan.")
                           

                if not daftar_beli:
                    print("Tidak ada barang dipilih. Transaksi dibatalkan.")
                    return

                total = sum(self.barang[n] for n in daftar_beli)
                print(f"\nTotal harga transaksi: Rp{total}")

                while True:
                    try:
                        bayar = int(input("Masukkan jumlah uang yang dibayarkan: Rp"))
                        break
                    except ValueError:
                        print("Masukkan angka yang valid.")

                if bayar >= total:
                    kembalian = bayar - total
                    print(f"Transaksi berhasil! Kembalian Anda: Rp{kembalian}")
                else:
                    print("Uang yang dibayarkan tidak cukup. Transaksi gagal.")

        transaksi = Transaksi(barang)
        transaksi.proses_transaksi()

    elif perintah == "6" or perintah == "keluar":
        print("Keluar dari program. Terima kasih!")
        break





