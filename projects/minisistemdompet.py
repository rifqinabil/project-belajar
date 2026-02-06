class dompet :
    def __init__(self, saldo_awal): #ini adalah constructor untuk menginisialisasi saldo awal
        self.saldo = saldo_awal

    def tambah_saldo(self, jumlah): #method untuk menambah saldo
        self.saldo += jumlah
        print(f"Saldo berhasil ditambahkan. Saldo sekarang: Rp{self.saldo}")
        with open("catatanisisidompet.txt", "a") as file: #mencatat transaksi ke file
                file.write(f"Tambah saldo: Rp{jumlah}\n")
            
    def kurang_saldo(self, jumlah): #method untuk mengurangi saldo
        if jumlah > self.saldo: #cek apakah saldo mencukupi
            print("Saldo tidak mencukupi.")
        else:
            self.saldo -= jumlah #kurangi saldo jika mencukupi
            print(f"Saldo berhasil dikurangi. Saldo sekarang: Rp{self.saldo}")
        with open("catatanisisidompet.txt", "a") as file: #mencatat transaksi ke file
                file.write(f"Kurang saldo: Rp{jumlah}\n")
    
    def cek_saldo(self):
            with open("catatanisisidompet.txt", "r") as file: #membaca file untuk menampilkan saldo saat ini
                lines = file.readlines()
                if not lines: #jika file kosong
                    print(f"Saldo Anda saat ini: Rp{self.saldo}")
                    return self.saldo
                last_line = lines[-1]
                if "Tambah saldo" in last_line: #cek apakah transaksi terakhir adalah penambahan saldo
                    last_amount = int(last_line.split(": Rp")[1])
                    self.saldo += last_amount
                elif "Kurang saldo" in last_line: #cek apakah transaksi terakhir adalah pengurangan saldo
                    last_amount = int(last_line.split(": Rp")[1])
                    self.saldo -= last_amount
                print(f"Saldo Anda saat ini: Rp{self.saldo}")
                return self.saldo
    
    def transfer_saldo(self, jumlah, penerima):
        if jumlah > self.saldo:
            print("Saldo tidak mencukupi untuk transfer.")
        else:
            self.saldo -= jumlah
            print(f"Transfer sebesar Rp{jumlah} ke {penerima} berhasil. Saldo sekarang: Rp{self.saldo}")
            with open("catatanisisidompet.txt", "a") as file:
                file.write(f"Transfer ke {penerima}: Rp{jumlah}\n")

    def terima_saldo(self, jumlah, pengirim):
        self.saldo += jumlah
        print(f"Anda menerima Rp{jumlah} dari {pengirim}. Saldo sekarang: Rp{self.saldo}")
        with open("catatanisisidompet.txt", "a") as file:
                file.write(f"Terima saldo dari {pengirim}: Rp{jumlah}\n")

    def riwayat_transaksi(self):
        print("\n--- Riwayat Transaksi ---")
        try:
            with open("catatanisisidompet.txt", "r") as file:
                lines = file.readlines()
                if not lines:
                    print("Belum ada transaksi yang dilakukan.")
                    return
                for line in lines:
                    print(line.strip())
        except FileNotFoundError:
            print("Belum ada transaksi yang dilakukan.")

if __name__ == "__main__":
    dompet_saya = dompet(0)
    while True:
        print("\n--- Mini Sistem Dompet ---")
        print("1. Tambah Saldo")
        print("2. Kurang Saldo")
        print("3. Cek Saldo")
        print("4. Transfer Saldo")
        print("5. Terima Saldo")
        print("6. Riwayat Transaksi")
        print("7. Keluar")

        pilihan = input("Pilih opsi (1-7): ")

        if pilihan == "1":
            jumlah = int(input("Masukkan jumlah saldo yang ingin ditambahkan: Rp"))
            dompet_saya.tambah_saldo(jumlah)
        
        elif pilihan == "2":
            jumlah = int(input("Masukkan jumlah saldo yang ingin dikurangi: Rp"))
            dompet_saya.kurang_saldo(jumlah)

        elif pilihan == "3":
            dompet_saya.cek_saldo()

        elif pilihan == "4":
            jumlah = int(input("Masukkan jumlah saldo yang ingin ditransfer: Rp"))
            penerima = input("Masukkan nama penerima: ")
            dompet_saya.transfer_saldo(jumlah, penerima)

        elif pilihan == "5":
            jumlah = int(input("Masukkan jumlah saldo yang diterima: Rp"))
            pengirim = input("Masukkan nama pengirim: ")
            dompet_saya.terima_saldo(jumlah, pengirim)

        elif pilihan == "6":   
            dompet_saya.riwayat_transaksi()

        elif pilihan == "7":
            print("Keluar dari Mini Sistem Dompet. Terima kasih!")
            break