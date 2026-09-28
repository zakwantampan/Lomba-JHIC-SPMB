"use strict";

// Isi endpoint PHP kamu di sini (contoh: "api/login.php" dan "api/register.php").
// Selama masih kosong, form hanya divalidasi dan belum mengirim data ke server.
const AUTH_CONFIG = {
  loginEndpoint: "",
  registerEndpoint: "",
  afterLoginUrl: "index.html"
};

const card = document.querySelector(".auth-card");
const views = {
  login: document.querySelector("#view-login"),
  register: document.querySelector("#view-register")
};

function showView(name, { focus = true, updateHash = true } = {}) {
  if (!views[name]) name = "login";
  Object.entries(views).forEach(([key, el]) => { el.hidden = key !== name; });
  card.dataset.view = name;
  document.title = (name === "login" ? "Masuk" : "Daftar") + " — SPMB SMAKENSA";
  if (updateHash) history.replaceState(null, "", name === "register" ? "#daftar" : "#masuk");
  if (focus) views[name].querySelector("input")?.focus();
}

document.querySelectorAll("[data-switch]").forEach(btn =>
  btn.addEventListener("click", () => showView(btn.dataset.switch)));

showView(location.hash === "#daftar" ? "register" : "login", { focus: false, updateHash: false });
window.addEventListener("hashchange", () =>
  showView(location.hash === "#daftar" ? "register" : "login", { focus: false, updateHash: false }));

// Tampilkan / sembunyikan kata sandi
document.querySelectorAll(".toggle-pass").forEach(btn => {
  btn.addEventListener("click", () => {
    const input = btn.parentElement.querySelector("input");
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    btn.textContent = show ? "Sembunyikan" : "Lihat";
    btn.setAttribute("aria-pressed", String(show));
    btn.setAttribute("aria-label", show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi");
  });
});

// ===== Validasi =====
function setError(input, message) {
  const note = document.querySelector(`.error[data-for="${input.id}"]`);
  input.classList.toggle("invalid", Boolean(message));
  input.setAttribute("aria-invalid", message ? "true" : "false");
  if (note) note.textContent = message || "";
  return !message;
}

const rules = {
  "login-id": v => !v ? "Email atau NISN wajib diisi." : "",
  "login-pass": v => !v ? "Kata sandi wajib diisi." : "",
  "reg-nama": v => v.trim().length < 3 ? "Nama lengkap minimal 3 karakter." : "",
  "reg-nisn": v => !/^\d{10}$/.test(v) ? "NISN harus 10 digit angka." : "",
  "reg-hp": v => !/^(\+62|62|0)8\d{7,12}$/.test(v.replace(/[\s-]/g, "")) ? "Nomor WhatsApp tidak valid." : "",
  "reg-email": v => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Format email tidak valid." : "",
  "reg-pass": v => v.length < 8 ? "Kata sandi minimal 8 karakter." : "",
  "reg-pass2": (v, form) => v !== form.querySelector("#reg-pass").value ? "Kata sandi tidak sama." : ""
};

function validate(form) {
  let ok = true;
  form.querySelectorAll("input[required]").forEach(input => {
    const check = rules[input.id];
    if (check && !setError(input, check(input.value, form))) ok = false;
  });
  return ok;
}

document.querySelectorAll("form").forEach(form => {
  form.querySelectorAll("input[required]").forEach(input =>
    input.addEventListener("input", () => {
      if (input.classList.contains("invalid")) setError(input, rules[input.id]?.(input.value, form));
    }));
});

// NISN hanya angka
document.querySelector("#reg-nisn").addEventListener("input", e => {
  e.target.value = e.target.value.replace(/\D/g, "");
});

// ===== Submit =====
async function submitForm(form, endpoint, onSuccess) {
  const status = form.querySelector(".form-status");
  status.className = "form-status";
  status.textContent = "";

  if (!validate(form)) {
    form.querySelector(".invalid")?.focus();
    return;
  }

  if (!endpoint) {
    status.classList.add("bad");
    status.textContent = "Form valid, tetapi belum terhubung ke server. Isi AUTH_CONFIG di auth.js.";
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    const response = await fetch(endpoint, { method: "POST", body: new FormData(form), credentials: "same-origin" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === false) throw new Error(data.message || "Permintaan gagal. Coba lagi.");
    status.classList.add("ok");
    status.textContent = data.message || "Berhasil.";
    onSuccess?.(data);
  } catch (err) {
    status.classList.add("bad");
    status.textContent = err.message;
  } finally {
    button.disabled = false;
  }
}

document.querySelector("#form-login").addEventListener("submit", e => {
  e.preventDefault();
  submitForm(e.target, AUTH_CONFIG.loginEndpoint, data => {
    window.location.assign(data.redirect || AUTH_CONFIG.afterLoginUrl);
  });
});

document.querySelector("#form-register").addEventListener("submit", e => {
  e.preventDefault();
  submitForm(e.target, AUTH_CONFIG.registerEndpoint, () => {
    e.target.reset();
    setTimeout(() => showView("login"), 1200);
  });
});

document.querySelector("[data-forgot]").addEventListener("click", e => {
  e.preventDefault();
  const status = document.querySelector("#form-login .form-status");
  status.className = "form-status bad";
  status.textContent = "Fitur lupa kata sandi belum tersedia. Hubungi panitia SPMB.";
});
