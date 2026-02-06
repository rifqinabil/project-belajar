import hashlib # ini berfungsi untuk mengamankan data password
import os # ini berfungsi untuk pengelolaan file dan direktori (membuat, menghapus, mengubah nama), navigasi folder (mendapatkan path saat ini), mengelola variabel lingkungan, serta menjalankan perintah sistem
import base64 # ini berfungsi untuk mengonversi data biner (seperti gambar, audio, atau file mentah) menjadi representasi teks ASCII, dan sebaliknya (dekode).
import hmac # ini berfungsi untuk membuat kode otentikasi pesan berbasis hash (Hash-based Message Authentication Code) guna memastikan integritas (data tidak diubah) dan keaslian (pengirim sah) suatu pesan atau data.

user = {}  # dictionary untuk menyimpan data user: username -> {"password": ..., "saldo": ...}

# --- Password hashing utilities (PBKDF2-HMAC-SHA256) ---
# We use hashlib.pbkdf2_hmac with a per-user random salt and a high iteration count.
# Stored format: pbkdf2_sha256$<iterations>$<salt_b64>$<dk_b64>

def hash_password(password, iterations=100_000):
    """
    Hash password using PBKDF2-HMAC-SHA256 with a 16-byte random salt.
    Returns a string safe to store in the user data file.
    """
    salt = os.urandom(16)
    dk = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, iterations)
    salt_b64 = base64.b64encode(salt).decode('ascii')
    dk_b64 = base64.b64encode(dk).decode('ascii')
    return f"pbkdf2_sha256${iterations}${salt_b64}${dk_b64}"


def verify_password(stored, password):
    """
    Verify a password against the stored representation.
    Supports legacy plain-text entries: if stored does not start with the
    prefix, it will be compared as plain text (and can be upgraded on login).
    """
    if stored.startswith("pbkdf2_sha256$"):
        try:
            _alg, iterations, salt_b64, dk_b64 = stored.split('$', 3)
            iterations = int(iterations)
            salt = base64.b64decode(salt_b64)
            dk = base64.b64decode(dk_b64)
            new_dk = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, iterations)
            return hmac.compare_digest(new_dk, dk)
        except Exception:
            return False
    else:
        # Legacy plain text comparison (use compare_digest to reduce timing info)
        return hmac.compare_digest(password, stored)



try:  # coba membaca file data user saat program mulai
    with open("user_data.txt", "r") as file:  # buka file user_data.txt untuk membaca
        for line in file:  # iterasi setiap baris dalam file
            line = line.strip()  # hapus whitespace di awal/akhir baris
            if not line:  # jika baris kosong, abaikan
                continue  # lanjutkan ke baris berikutnya
            parts = line.split(",", 2)  # pisahkan menjadi maksimal 3 bagian: username,password,saldo
            if len(parts) == 3:  # jika ada 3 bagian (username,password,saldo)
                username, password, saldo = parts  # unpack bagian-bagian tersebut
                try:
                    saldo_val = float(saldo.strip())  # coba konversi string saldo menjadi float
                except ValueError:  # jika konversi gagal
                    print(f"Warning: invalid saldo for user '{username}', setting to 0")  # tampilkan peringatan
                    saldo_val = 0.0  # set saldo default 0.0
                user[username.strip()] = {"password": password.strip(), "saldo": saldo_val}  # simpan user ke dictionary
            elif len(parts) == 2:  # jika hanya ada username dan password
                username, password = parts  # unpack username dan password
                user[username.strip()] = {"password": password.strip(), "saldo": 0.0 }  # simpan dengan saldo default 0.0
            else:  # format baris tidak dikenali
                print(f"Warning: skipping invalid line in user_data.txt: {line}")  # tampilkan peringatan
                continue  # lanjut ke iterasi berikutnya

except FileNotFoundError:  # jika file user_data.txt tidak ditemukan
    pass    # biarkan kosong, tidak ada data user awal


def register():  # fungsi untuk registrasi user baru
    print("\n--- Register ---")  # header menu registrasi
    while True:  # loop hingga registrasi berhasil atau user memilih keluar
        username = input("Masukkan username: ")  # minta input username
        username = username.strip()  # hapus whitespace di awal/akhir username
        if username in user:  # cek apakah username sudah ada
            print("Username sudah terdaftar. Silakan coba lagi.")  # beri tahu user
        elif username == "":  # cek apakah username kosong
            print("Username tidak boleh kosong.")  # beri tahu user
        else:
            password = input("Masukkan password: ").strip()  # minta input password dan trim
            # Hash password sebelum disimpan
            hashed = hash_password(password)
            user[username] = {"password": hashed, "saldo": 0.0}  # simpan hashed password
            simpan_semua_user()  # simpan semua data user ke file untuk konsistensi
            print("Registrasi berhasil!")  # konfirmasi registrasi
            break   # keluar dari loop registrasi
        exit_choice = input("Apakah Anda ingin keluar dari registrasi? (ya/tidak): ").lower()  # tanya apakah ingin keluar
        if exit_choice == "ya":  # jika user ingin keluar
            return False  # kembalikan False untuk menghentikan proses registrasi

def login():  # fungsi untuk login user
    print("\n--- Login ---")  # header menu login
    kesempatan = 3  # jumlah kesempatan login lokal
    while kesempatan > 0:  # loop sampai kesempatan habis atau login berhasil
        username = input("Masukkan username: ")  # minta input username
        password = input("Masukkan password: ")  # minta input password
        username = username.strip()  # hapus whitespace di username
        password = password.strip()  # hapus whitespace di password
        if username in user and verify_password(user[username]["password"], password):  # cek kredensial
            # Jika password disimpan dalam format lama (plain text), upgrade ke PBKDF2
            if not user[username]["password"].startswith("pbkdf2_sha256$"):
                user[username]["password"] = hash_password(password)
                simpan_semua_user()
            print("Login berhasil!")  # tampilkan pesan sukses
            return username  # kembalikan username yang berhasil login
        else:
            kesempatan -= 1  # kurangi kesempatan login
            if kesempatan == 0:
                print("Login gagal. Kesempatan habis.")
                return None  # kembalikan None jika kesempatan habis
            else:
                print(f"Username atau password salah. Kesempatan tersisa: {kesempatan}")  # tampilkan pesan kesalahan dan sisa kesempatan

def simpan_semua_user():  # fungsi untuk menulis ulang seluruh data user ke file
    with open("user_data.txt", "w") as file:  # buka file untuk menulis (akan menimpa isi lama)
        for username, data in user.items():  # iterasi setiap pasangan username dan data
            file.write(f"{username},{data['password']},{data['saldo']}\n")  # tulis baris dengan format username,password,saldo


def main():  # fungsi utama yang menampilkan menu
    while True:  # loop menu utama
        print("\n--- Sistem Login ---")  # header menu utama
        print("1. Login")  # opsi login
        print("2. Register")  # opsi registrasi
        print("3. Keluar")  # opsi keluar

        choice = input("Pilih opsi (1-3): ")  # minta input pilihan dari user

        if choice == "1":  # jika user memilih login
            current_user = login()  # panggil fungsi login dan simpan hasilnya
            if current_user: ## jika login berhasil (mengembalikan username)
                print(f"Masuk sistem dompet untuk: {current_user}")  # tampilkan siapa yang masuk
                menu_dompet(current_user)  # panggil fungsi menu dompet dengan username yang masuk
                break  # keluar dari loop menu utama
        elif choice == "2":  # jika user memilih registrasi
            register()  # panggil fungsi register
        elif choice == "3":  # jika user memilih keluar
            print("Keluar dari program.")  # tampil pesan keluar
            exit()  # keluar dari program
        else:
            print("Opsi tidak valid. Silakan coba lagi.")  # jika pilihan tidak valid, beri tahu user

def menu_dompet(username):  # fungsi menu dompet digital
    while True:  # loop menu dompet
        print(f"\n--- Dompet Digital untuk {username} ---")  # header menu dompet
        print("1. Cek Saldo")  # opsi cek saldo
        print("2. Tambah Saldo")  # opsi tambah saldo
        print("3. Keluar")  # opsi keluar
        choice = input("Pilih opsi (1-3): ")  # minta input pilihan dari user

        if choice == "1":  # jika user
            saldo = user[username]["saldo"]  # ambil saldo user
            print(f"Saldo Anda: Rp {saldo:.2f}")  # tampilkan saldo dengan format dua desimal
        elif choice == "2":  # jika user memilih tambah saldo
            try:
                amount = float(input("Masukkan jumlah yang akan ditambahkan: "))  # minta input jumlah saldo yang akan ditambahkan
                if amount <= 0:  # cek apakah jumlah valid
                    print("Jumlah harus lebih dari 0.")  # beri tahu user jika jumlah tidak valid
                else:
                    user[username]["saldo"] += amount  # tambahkan jumlah ke saldo user
                    simpan_semua_user()  # simpan perubahan ke file
                    print(f"Saldo berhasil ditambahkan. Saldo baru: Rp {user[username]['saldo']:.2f}")  # konfirmasi penambahan saldo
            except ValueError:  # jika input bukan angka
                print("Input tidak valid. Silakan masukkan angka.")  # beri tahu user
        elif choice == "3":  # jika user memilih keluar
            print("Keluar dari dompet digital.")  # tampil pesan keluar
            break  # keluar dari loop menu dompet
        else:
            print("Opsi tidak valid. Silakan coba lagi.")  # jika pilihan tidak valid, beri tahu user
if __name__ == "__main__":  # blok ini dieksekusi jika file dijalankan langsung
    main()  # jalankan fungsi utama


