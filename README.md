# Landing Page SPMB SMAKENSA

Implementasi HTML, CSS, dan JavaScript berdasarkan `Downloads/LandingPage-SPMB.png`.

## Membuka website

Klik dua kali `index.html` untuk membukanya di browser. Tidak perlu instalasi paket atau koneksi internet. Bisa juga dibuka melalui Live Server di VS Code.

Hasil screenshot tersedia di `previews/desktop.png` dan `previews/mobile.png`. Pemeriksaan browser dapat diulang dengan `node tools/verify.cjs` jika Node.js serta Chrome atau Edge tersedia. Pemeriksaan mencakup lima lebar layar (320, 390, 768, 1024, dan 1280 piksel), aset lokal, menu HP, FAQ, dan dialog informasi.

## File

- `index.html`: struktur halaman dan timeline.
- `style.css`: tata letak dasar desktop, tablet, dan HP.
- `design.css`: font Plus Jakarta Sans lokal, ikon dan ornamen asli, warna background, kolase poster, serta garis timeline.
- `script.js`: konten kartu, menu HP, FAQ, dialog informasi, rotasi poster, dan progres timeline.
- `assets/design/`: aset dari folder `Downloads/Assets SPMB New`, termasuk poster, font, dan lisensi font.

Logo, ikon, dan ornamen menggunakan aset asli yang disediakan. Font Plus Jakarta Sans dimuat secara lokal sehingga tetap berfungsi tanpa internet. Mockup lama tetap disimpan sebagai referensi, tetapi tidak lagi digunakan untuk kolase poster.

## Animasi

Tujuh poster prestasi disusun pada posisi awal mengikuti prototype, lalu bergantian menempati posisi berikutnya setiap 4,2 detik. Arah susunan dan posisi diatur melalui `posterSlots` di `script.js`. Tombol sebelumnya, jeda, dan berikutnya muncul saat kolase disentuh fokus/hover atau dilihat pada layar HP. Tombol panah keyboard juga dapat digunakan saat kontrol terfokus.

Rotasi tetap berjalan saat pointer berada di kolase atau kontrol mendapat fokus. Tombol Jeda menghentikan rotasi sampai tombol Putar ditekan. Rotasi juga berhenti sementara saat kolase berada di luar layar atau tab tidak aktif. Preferensi perangkat `prefers-reduced-motion` menjeda rotasi secara default dan menghilangkan transisi; pengguna tetap dapat memilih Putar atau navigasi manual.

Garis timeline terisi sampai titik baca pada 58% tinggi layar. Saat menggulir kembali ke atas, garis menyusut sesuai posisi scroll. Penanda oranye mengikuti ujung garis; lingkaran tahap dan lingkaran kecil pada akhir setiap garis ikut berubah warna saat dilewati.

## Menyambungkan layanan resmi

Pada bagian atas `script.js`, isi `SITE_CONFIG.portalUrl` dengan URL HTTPS portal resmi dan `SITE_CONFIG.callCenter` dengan nomor WhatsApp format internasional (contoh format: 62 diikuti nomor tanpa nol awal). Sebelum diisi, tombol menampilkan informasi bahwa layanan belum dihubungkan.

Unduhan dokumen, statistik peminat, dan autentikasi belum terhubung ke layanan server. Tidak ada formulir yang mengumpulkan atau menyimpan data pribadi. Jadwal, persyaratan, dan angka fasilitas menyalin materi mockup, bukan hasil verifikasi informasi resmi terkini. Tiga pertanyaan FAQ dibuat berbeda agar masing-masing memberi informasi berguna.
