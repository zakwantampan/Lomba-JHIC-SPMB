"use strict";

// Ubah URL dan nomor ini ketika portal resmi sudah tersedia.
// Semua tanggal dan angka fasilitas mengikuti mockup yang diberikan.
const SITE_CONFIG = { portalUrl: "", callCenter: "" };

const iconFiles = {
  shield: "Circle-Check Icon.png",
  code: "Rekayasa Perangkat Lunak Icon.png",
  wifi: "Teknik Komputer dan Jaringan Icon.png",
  palette: "Desain Komunikasi Visual Icon.png",
  calculator: "Akutansi Icon.png",
  case: "Manajemen Perkantoran Icon.png",
  bag: "Bisnis Digital Icon.png",
  video: "Produksi Siaran Televisi Icon.png",
  money: "Layanan Perbankan Icon.png",
  monitor: "Laboratorium Komputer Icon.png",
  books: "Perpustakaan Icon.png",
  wireless: "Wifi Icon.png",
  moon: "Masjid Icon.png",
  room: "Ruang Kelas Icon.png"
};
const icon = name => `<img class="asset-icon" src="assets/design/${iconFiles[name]}" alt="" aria-hidden="true">`;

const features = [
  ["katalog", "Katalog Kompetensi Keahlian", "Penjelasan mendalam mengenai kurikulum dan peluang kerja di setiap jurusan yang ada di SMKN 1 Bondowoso."],
  ["chat", "Live Chat Support Center", "Layanan tanya jawab responsif melalui admin chat terintegrasi untuk membantu kendala teknis maupun administratif."],
  ["alur", "Alur Seleksi Interaktif", "Panduan tahap demi tahap pendaftaran agar calon siswa tidak bingung mengenai berkas dan jadwal."],
  ["dokumen", "Pusat Unduhan Dokumen", "Akses cepat untuk mengunduh brosur, formulir registrasi, dan berkas pendukung lainnya."],
  ["statistik", "Statistik Peminat Real-time", "Informasi transparan mengenai jumlah peminat di tiap kompetensi keahlian sebagai bahan pertimbangan calon siswa."]
];
document.querySelector("#digital-grid").innerHTML = features.map(([id, title, text]) => `<button type="button" class="digital-card" data-info="${id}"><span class="icon-tile">${icon("shield")}</span><h3>${title}</h3><p>${text}</p></button>`).join("");

const programs = [
  ["code", "Rekayasa Perangkat Lunak (RPL)", "Fokus pada pengembangan perangkat lunak secara menyeluruh. Siswa belajar bahasa pemrograman, membuat pengembangan web (Front-end & Back-end), aplikasi mobile (Android/iOS), pengelolaan basis data (SQL), serta penerapan proyek IT berbasis tim menggunakan metodologi Agile."],
  ["wifi", "Teknik Komputer & Jaringan (TKJ)", "Mempelajari instalasi, konfigurasi, dan perbaikan perangkat keras komputer serta infrastruktur jaringan. Fokus pada keamanan siber (cyber security), administrasi server (Linux/Windows), troubleshooting jaringan, serta teknologi jaringan kabel maupun nirkabel (wireless)."],
  ["palette", "Desain Komunikasi Visual (DKV)", "Mengasah kreativitas dalam menyampaikan pesan melalui media visual. Belajar tentang desain, ilustrasi, tipografi, videografi, hingga pemanfaatan media. Standar industri menggunakan software seperti Adobe Photoshop dan Illustrator untuk menghasilkan karya estetis dan aplikatif."],
  ["calculator", "Akuntansi dan Keuangan Lembaga (AKL)", "Mempelajari pengelolaan transaksi keuangan secara teliti dan sistematis. Mulai dari penjurnalan manual hingga penggunaan aplikasi akuntansi komputer (Spreadsheet, MYOB, Accurate) untuk kebutuhan perusahaan jasa, dagang, dan manufaktur."],
  ["case", "Manajemen Perkantoran (MP)", "Menyiapkan tenaga profesional di bidang administrasi perkantoran modern. Siswa dilatih dalam manajemen kearsipan digital, komunikasi bisnis, pengelolaan rapat, hingga layanan pelanggan (Customer Service) yang prima."],
  ["bag", "Bisnis Digital (BD)", "Mempelajari strategi pemasaran di era internet. Fokus pada bisnis Digital Marketing, pengelolaan toko online di marketplace, optimasi website (SEO), media sosial, serta analisis data pasar untuk meningkatkan penjualan."],
  ["video", "Produksi Siaran Program Televisi (PSPT)", "Mempelajari seluruh proses pembuatan program televisi mulai dari pra-produksi (ide dan naskah), produksi (pengambilan gambar dan tata cahaya), hingga pasca-produksi (editing video). Siswa dilatih menggunakan peralatan profesional untuk penyiaran, manajemen studio, dan teknik pengambilan suara."],
  ["money", "Layanan Perbankan (LPB)", "Menyiapkan tenaga terampil di bidang operasional bank dan lembaga keuangan. Fokus pada pelayanan nasabah (frontliner), pengelolaan administrasi perbankan seperti tabungan, kredit, serta pemahaman tentang regulasi dan prosedur keamanan transaksi keuangan."]
];
document.querySelector("#program-grid").innerHTML = programs.map(([symbol, title, text]) => `<article class="program-card"><span class="icon-tile">${icon(symbol)}</span><h3>${title}</h3><p>${text}</p></article>`).join("");

const facilities = [
  ["monitor", "Lab Komputer", "15 Laboratorium Komputer", "Komputer memadai untuk praktik pemrograman & desain"],
  ["books", "Perpustakaan", "1000+ Buku", "Koleksi buku & ruang baca nyaman untuk belajar"],
  ["wireless", "WiFi Area", "10 Titik Sebaran", "Akses internet untuk pembelajaran digital."],
  ["moon", "Masjid", "1 Fasilitas Keagamaan", "Area Tempat Ibadah Yang Luas dan Nyaman serta Mendukung Segala Aktivitas Keagamaan."],
  ["room", "Ruang Kelas", "35 Ruang Kelas", "Area Ruang Kelas yang nyaman dan menyenangkan."]
];
document.querySelector("#facility-grid").innerHTML = facilities.map(([symbol, title, stat, text]) => `<article class="facility-card">${icon(symbol)}<h3>${title}</h3><p class="facility-stat">${stat}</p><p>${text}</p></article>`).join("");

const nav = document.querySelector("#navigasi");
const toggle = document.querySelector(".menu-toggle");
function closeMenu() { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Buka menu"); }
toggle.addEventListener("click", () => { const open = nav.classList.toggle("is-open"); toggle.setAttribute("aria-expanded", String(open)); toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu"); });
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("click", event => { if (!event.target.closest(".site-header")) closeMenu(); });
document.addEventListener("keydown", event => { if (event.key === "Escape" && nav.classList.contains("is-open")) { closeMenu(); toggle.focus(); } });
window.matchMedia("(min-width: 801px)").addEventListener("change", closeMenu);

const faqStates = [...document.querySelectorAll(".faq details")].map(details => {
  const panel = document.createElement("div");
  panel.className = "faq-panel";
  const answer = details.querySelector(".faq-answer");
  answer.before(panel);
  panel.append(answer);
  const triangle = document.createElement("span");
  triangle.className = "faq-triangle";
  triangle.setAttribute("aria-hidden", "true");
  details.querySelector("summary").append(triangle);
  return { details, panel, triangle, summary: details.querySelector("summary"), expanded: details.open, animation: null };
});
function animateFaq(state, expanded) {
  const { details, summary, panel } = state;
  const start = details.open ? panel.getBoundingClientRect().height : 0;
  state.animation?.cancel();
  state.expanded = expanded;
  summary.setAttribute("aria-expanded", String(expanded));
  details.classList.toggle("is-expanded", expanded);
  details.open = true;
  const end = expanded ? panel.getBoundingClientRect().height : 0;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    details.open = expanded;
    return;
  }
  const animation = panel.animate({ height: [`${start}px`, `${end}px`] }, {
    duration: 440, easing: "cubic-bezier(.22, 1, .36, 1)"
  });
  state.animation = animation;
  animation.onfinish = () => {
    details.open = expanded;
    state.animation = null;
  };
}
faqStates.forEach(state => {
  state.summary.setAttribute("aria-expanded", String(state.expanded));
  state.summary.addEventListener("click", event => {
    event.preventDefault();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      state.triangle.getAnimations().forEach(animation => animation.cancel());
      state.triangle.animate({ transform: ["rotate(50deg)", "rotate(410deg)"] }, {
        duration: 1200, easing: "cubic-bezier(.22, 1, .36, 1)"
      });
    }
    const expanded = !state.expanded;
    if (expanded) faqStates.forEach(other => { if (other !== state && other.expanded) animateFaq(other, false); });
    animateFaq(state, expanded);
  });
});

const messages = {
  masuk: ["Masuk ke portal SPMB", "<p>Portal akun pendaftaran belum dihubungkan ke website ini. Kamu tetap dapat mempelajari program keahlian dan melihat tahapan pendaftaran.</p><p><a href='#timeline'>Lihat timeline pendaftaran →</a></p>"],
  kontak: ["Call Center SPMB", "<p>Nomor call center belum tercantum pada mockup. Kontak panitia akan tersedia di sini setelah nomor resmi ditambahkan.</p><p>Sambil mempersiapkan pendaftaran, lihat <a href='#timeline'>tahapan dan dokumen</a> yang tercantum pada desain.</p>"],
  chat: ["Live Chat Support Center", "<p>Layanan chat akan tersedia setelah kontak resmi panitia dihubungkan. Untuk saat ini, kamu dapat membaca <a href='#faq'>pertanyaan yang sering ditanyakan</a> dan alur pendaftaran.</p>"],
  dokumen: ["Pusat Unduhan Dokumen", "<p>Brosur dan formulir resmi belum disertakan dalam bahan desain. Dokumen unduhan dapat ditambahkan ketika tersedia.</p><p>Lihat <a href='#timeline'>daftar dokumen yang perlu dipersiapkan</a> pada tahap pengambilan PIN.</p>"],
  statistik: ["Statistik Peminat", "<p>Data peminat belum tersedia. Bagian ini perlu dihubungkan dengan data pendaftaran agar dapat menampilkan jumlah peminat setiap kompetensi keahlian secara real-time.</p>"],
};
const dialog = document.querySelector("#info-dialog");
document.addEventListener("click", event => {
  const trigger = event.target.closest("[data-info]");
  if (!trigger) return;
  const key = trigger.dataset.info;
  if (key === "katalog" || key === "alur") { document.querySelector(key === "katalog" ? "#jurusan" : "#timeline").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); return; }
  if (key === "masuk" && /^https:\/\//.test(SITE_CONFIG.portalUrl)) { window.location.assign(SITE_CONFIG.portalUrl); return; }
  if ((key === "kontak" || key === "chat") && SITE_CONFIG.callCenter) { window.location.assign(`https://wa.me/${SITE_CONFIG.callCenter.replace(/\D/g, "")}`); return; }
  const message = messages[key];
  if (!message) return;
  document.querySelector("#dialog-title").textContent = message[0];
  document.querySelector("#dialog-content").innerHTML = message[1];
  closeMenu();
  dialog.showModal();
});
dialog.querySelectorAll(".dialog-close,.dialog-done").forEach(button => button.addEventListener("click", () => dialog.close()));
dialog.addEventListener("click", event => {
  if (event.target.closest("a")) dialog.close();
  if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); }
});

// Posisi awal diukur dari prototype; setiap poster menempati slot berikutnya.
const posterItems = [
  {
    "file": "Lomba Sketsa Rancangan Layangan Sikep Tingkat Nasional yang diselenggarakan oleh Himadipsi ISI SURAKARTA 1.png",
    "title": "Lomba Sketsa Rancangan Layangan Sikep Tingkat Nasional yang diselenggarakan oleh Himadipsi ISI SURAKARTA"
  },
  {
    "file": "Juara 2 Karate KEJURPROV FORKI Jawa Timur 2026 di Malang.(1) 1.png",
    "title": "Juara 2 Karate KEJURPROV FORKI Jawa Timur 2026 di Malang"
  },
  {
    "file": "Juara 1 Lomba Orasi Dalam Rangka Harlah PMII Ke-66 1.png",
    "title": "Juara 1 Lomba Orasi Dalam Rangka Harlah PMII Ke-66"
  },
  {
    "file": "Juara 1 Lomba Kebersihan Sekolah Program ASRI 1.png",
    "title": "Juara 1 Lomba Kebersihan Sekolah Program ASRI"
  },
  {
    "file": "Juara Harapan II Katagori Putri Lomba Gerak Jalan Pelajar 1.png",
    "title": "Juara Harapan II Katagori Putri Lomba Gerak Jalan Pelajar"
  },
  {
    "file": "Voli Smakensa meraih Juara 1 pada kegiatan Gebyar Olahraga Siswa SMK seKabupaten Bondowoso 1.png",
    "title": "Voli Smakensa meraih Juara 1 pada kegiatan Gebyar Olahraga Siswa SMK seKabupaten Bondowoso"
  },
  {
    "file": "Telah lolos Seleksi Paskibra Kabupaten Bondowoso 1.png",
    "title": "Telah lolos Seleksi Paskibra Kabupaten Bondowoso"
  }
];
const posterSlots = [
  { left: 31.75, top: 39.71, depth: 7 }, // depan tengah: layangan
  { left: 51.75, top: 32.17, depth: 6 }, // depan kanan: karate
  { left: 60.63, top: 22.03, depth: 4 }, // tengah kanan: orasi
  { left: 50, top: 1.59, depth: 2 },     // belakang kanan: ASRI
  { left: 15.4, top: 6.38, depth: 1 },  // belakang kiri: gerak jalan
  { left: 3.33, top: 22.17, depth: 3 }, // tengah kiri: voli
  { left: 11.11, top: 32.6, depth: 5 }  // depan kiri: paskibra
];
const gallery = document.querySelector(".poster-gallery");
const stage = document.querySelector("#poster-stage");
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
let posterStep = 0;
let posterTimer;
let galleryVisible = false;

const posters = posterItems.map((item, index) => {
  const img = document.createElement("img");
  img.className = "poster";
  img.src = `assets/design/Folder Poster Juara (Landing SECTION)/${item.file}`;
  img.alt = item.title;
  img.width = 230;
  img.height = 288;
  img.draggable = false;
  if (index === 0) img.fetchPriority = "high";
  stage.append(img);
  return img;
});

function renderPosters() {
  posters.forEach((poster, index) => {
    const slotIndex = (index + posterStep + posters.length) % posters.length;
    const slot = posterSlots[slotIndex];
    poster.style.setProperty("--poster-left", `${slot.left}%`);
    poster.style.setProperty("--poster-top", `${slot.top}%`);
    poster.style.setProperty("--poster-depth", slot.depth);
    poster.dataset.slot = String(slotIndex);
    poster.setAttribute("aria-hidden", String(slotIndex !== 0));
  });
}

function syncPosterTimer() {
  clearInterval(posterTimer);
  if (motionPreference.matches || !galleryVisible || document.hidden) return;
  posterTimer = setInterval(() => {
    posterStep = (posterStep + 1) % posters.length;
    renderPosters();
  }, 2500);
}

new IntersectionObserver(entries => { galleryVisible = entries[0].isIntersecting; syncPosterTimer(); }, { threshold: 0.15 }).observe(gallery);
document.addEventListener("visibilitychange", syncPosterTimer);
motionPreference.addEventListener("change", () => {
  syncPosterTimer();
});
renderPosters();
syncPosterTimer();

// Panjang garis berasal dari posisi scroll, sehingga kembali menyusut saat naik.
const timelineRails = [...document.querySelectorAll(".timeline-rail")];
timelineRails.forEach(rail => {
  const fill = document.createElement("i");
  fill.className = "timeline-fill";
  fill.setAttribute("aria-hidden", "true");
  const cursor = document.createElement("i");
  cursor.className = "timeline-cursor";
  cursor.setAttribute("aria-hidden", "true");
  rail.append(fill, cursor);
});
let timelineFrame = 0;
function updateTimeline() {
  timelineFrame = 0;
  const readingLine = window.innerHeight * 0.58;
  const measurements = timelineRails.map(rail => {
    const bounds = rail.getBoundingClientRect();
    const styles = getComputedStyle(rail);
    const start = parseFloat(styles.getPropertyValue("--rail-start"));
    const end = parseFloat(styles.getPropertyValue("--rail-end"));
    const length = Math.max(1, bounds.height - start - end);
    const progress = Math.max(0, Math.min(1, (readingLine - bounds.top - start) / length));
    const marker = rail.querySelector("span").getBoundingClientRect();
    return { rail, progress, reached: readingLine >= marker.top + marker.height / 2 };
  });
  measurements.forEach(({ rail, progress, reached }) => {
    rail.style.setProperty("--rail-progress", progress.toFixed(5));
    rail.classList.toggle("is-reached", reached);
    rail.classList.toggle("is-tracking", progress > 0 && progress < 1);
    rail.classList.toggle("is-complete", progress === 1);
  });
}
function queueTimelineUpdate() {
  if (!timelineFrame) timelineFrame = requestAnimationFrame(updateTimeline);
}
window.addEventListener("scroll", queueTimelineUpdate, { passive: true });
window.addEventListener("resize", queueTimelineUpdate);
new ResizeObserver(queueTimelineUpdate).observe(document.querySelector(".timeline"));
document.fonts.ready.then(queueTimelineUpdate);
queueTimelineUpdate();

// Reveal each content block once; keep content accessible without motion or JS.
const revealElements = [...document.querySelectorAll(
  "[data-scroll-reveal] .hero-copy > *, [data-scroll-reveal] .poster-gallery, " +
  "[data-scroll-reveal] .section-heading, [data-scroll-reveal] .digital-card, " +
  "[data-scroll-reveal] .program-card, [data-scroll-reveal] .facility-card, " +
  "[data-scroll-reveal] .timeline-card, [data-scroll-reveal] .faq details, " +
  "[data-scroll-reveal] .cta, .site-footer"
)];
if (!motionPreference.matches && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });
  revealElements.forEach(element => {
    const siblings = [...element.parentElement.children];
    element.style.setProperty("--reveal-delay", `${Math.min(siblings.indexOf(element) % 5, 4) * 65}ms`);
    element.classList.add("scroll-reveal");
    revealObserver.observe(element);
    element.addEventListener("focusin", () => element.classList.add("is-visible"));
  });
  motionPreference.addEventListener("change", () => {
    if (motionPreference.matches) {
      revealElements.forEach(element => element.classList.add("is-visible"));
      revealObserver.disconnect();
      faqStates.forEach(state => { state.animation?.finish(); });
    }
  });
}
