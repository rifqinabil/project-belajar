while True:

    print("---- Catatan Keuangan Pribadi ----")
    print("1. Tambah Catatan udpate saldo")
    print("2. Lihat Catatan dan sisa saldo")
    print("3. Ubah Nominal atau Hapus Catatan")
    print("4. Keluar")

    pilihan = input("Pilih opsi (1-4): ")

    if pilihan == "1":
        while True:
            tanggal = input("Masukkan tanggal (YYYY-MM-DD): ")
            deskripsi = input("Masukkan deskripsi: ")
            positif_negatif = input("Apakah ini pemasukan atau pengeluaran? (masukkan 'pemasukan' atau 'pengeluaran'): ").lower()
            if positif_negatif == 'pemasukan':  
                jumlah = int(input("Masukkan jumlah pemasukan: "))
            elif positif_negatif == 'pengeluaran':
                jumlah = -int(input("Masukkan jumlah pengeluaran: "))
            elif positif_negatif == 'exit':
                print("Input tidak valid. Silakan coba lagi.")
                continue
            with open("catatan_keuangan.txt", "a") as file:
                file.write(f"{tanggal}, {deskripsi}, {jumlah}\n")
            print("Catatan telah ditambahkan.")
            lagi = input("Apakah Anda ingin menambahkan catatan lain? (ya/tidak): ").lower()
            if lagi != "ya":
                break   
    
    elif pilihan == "2":
        total_saldo = 0
        print("\n--- Daftar Catatan Keuangan ---")
        try:
            with open("catatan_keuangan.txt", "r") as file:
                found = False
                for line in file:
                    line = line.strip()
                    if not line:
                        # lewati baris kosong
                        continue
                    parts = [p.strip() for p in line.split(",")]
                    if len(parts) < 3:
                        print(f"Baris diabaikan (format salah): {line}")
                        continue
                    tanggal, deskripsi, jumlah_str = parts[0], parts[1], parts[2]
                    try:
                        jumlah = int(jumlah_str)
                    except ValueError:
                        print(f"Jumlah tidak valid pada baris: {line}")
                        continue
                    total_saldo += jumlah
                    tipe = "Pemasukan" if jumlah > 0 else "Pengeluaran"
                    print(f"Tanggal: {tanggal}, Deskripsi: {deskripsi}, Jumlah: {jumlah} ({tipe})")
                    found = True
                if not found:
                    print("Belum ada catatan yang dibuat.")
                else:
                    print(f"\nSisa saldo saat ini: {total_saldo}")
        except FileNotFoundError:
            print("Belum ada catatan yang dibuat.")
            continue
        
    elif pilihan == "3":
        lines = []
        try:
            with open("catatan_keuangan.txt", "r") as file:
                lines = file.readlines()
        except FileNotFoundError:
            print("Belum ada catatan yang dibuat.")
            continue

        print("\n--- Ubah atau Hapus Catatan ---")
        for idx, line in enumerate(lines):
            print(f"{idx + 1}. {line.strip()}")

        pilihan_ubah_hapus = input("Apakah Anda ingin mengubah (u) atau menghapus (h) catatan? (masukkan 'u' atau 'h'): ").lower()
        if pilihan_ubah_hapus not in ['u', 'h']:
            print("Input tidak valid. Silakan coba lagi.")
            continue

        nomor_catatan = int(input("Masukkan nomor catatan yang ingin diubah/hapus: ")) - 1
        if nomor_catatan < 0 or nomor_catatan >= len(lines):
            print("Nomor catatan tidak valid.")
            continue

        if pilihan_ubah_hapus == 'u':
            tanggal_baru = input("Masukkan tanggal baru (YYYY-MM-DD): ")
            deskripsi_baru = input("Masukkan deskripsi baru: ")
            positif_negatif_baru = input("Apakah ini pemasukan atau pengeluaran? (masukkan 'pemasukan' atau 'pengeluaran'): ").lower()
            if positif_negatif_baru == 'pemasukan':  
                jumlah_baru = int(input("Masukkan jumlah pemasukan baru: "))
            elif positif_negatif_baru == 'pengeluaran':
                jumlah_baru = -int(input("Masukkan jumlah pengeluaran baru: "))
            else:
                print("Input tidak valid. Silakan coba lagi.")
                continue
            lines[nomor_catatan] = f"{tanggal_baru}, {deskripsi_baru}, {jumlah_baru}\n"
            print("Catatan telah diperbarui.")
        elif pilihan_ubah_hapus == 'h':
            lines.pop(nomor_catatan)
            print("Catatan telah dihapus.")

        with open("catatan_keuangan.txt", "w") as file:
            file.writelines(lines)


        

    elif pilihan == "4":
        print("Keluar dari program. Terima kasih!")
        break
