// Pemeriksaan browser lokal, tanpa paket tambahan. Jalankan: node tools/verify.cjs
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const root = path.resolve(__dirname, '..');
const browserPath = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(p => fs.existsSync(p));
if (!browserPath) throw new Error('Chrome atau Edge tidak ditemukan.');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'spmb-preview-'));
const browser = spawn(browserPath, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const pending = new Map();
const errors = [];
let sequence = 0, ws, session;
function send(method, params = {}, sessionId = session) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timeout: ${method}`)); }, 15000);
    pending.set(id, { resolve, reject, timer });
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
function assert(ok, message) { if (!ok) throw new Error(message); }
(async () => {
  const endpoint = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Browser tidak siap')), 20000);
    let output = '';
    browser.stderr.on('data', chunk => { output += chunk; const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/); if (match) { clearTimeout(timer); resolve(match[1]); } });
    browser.on('error', reject);
  });
  ws = new WebSocket(endpoint);
  await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
  ws.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
    if (pending.has(message.id)) { const item = pending.get(message.id); pending.delete(message.id); clearTimeout(item.timer); message.error ? item.reject(new Error(message.error.message)) : item.resolve(message.result); }
  });
  const target = await send('Target.createTarget', { url: 'about:blank' });
  session = (await send('Target.attachToTarget', { targetId: target.targetId, flatten: true })).sessionId;
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: pathToFileURL(path.join(root, 'index.html')).href });
  for (let attempt = 0; attempt < 60; attempt++) { if (await evaluate('document.readyState === "complete" && document.querySelectorAll(".program-card").length === 8')) break; await pause(100); }
  await evaluate('document.fonts.ready');
  assert(await evaluate('document.fonts.check(\'16px "Plus Jakarta Sans"\') && getComputedStyle(document.body).fontFamily.includes("Plus Jakarta Sans")'), 'Font lokal belum termuat');
  assert(await evaluate('document.querySelectorAll(".poster").length === 7 && document.querySelectorAll(".asset-icon").length === 18'), 'Aset desain belum lengkap');
  assert(await evaluate('!document.querySelector(".poster-controls")'), 'Kontrol poster belum dihapus');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  assert(await evaluate('document.querySelectorAll(".program-card").length === 8 && document.querySelectorAll(".digital-card").length === 5 && document.querySelectorAll(".facility-card").length === 5'), 'Jumlah kartu tidak sesuai');
  const broken = await evaluate('Array.from(document.images).filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src)');
  assert(!broken.length, `Aset gagal dimuat: ${broken}`);
  const previews = path.join(root, 'previews');
  fs.mkdirSync(previews, { recursive: true });
  for (const width of [1920, 1440, 1280, 1024, 768, 390, 320]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
    await pause(100);
    const metrics = await evaluate('({ width: innerWidth, scroll: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight, overflow: [...document.querySelectorAll(".program-card,.digital-card,.facility-card")].filter(e => e.scrollWidth > e.clientWidth + 2).length })');
    assert(metrics.scroll <= width, `Overflow horizontal pada ${width}px: ${metrics.scroll}`);
    assert(metrics.overflow === 0, `Konten kartu meluap pada ${width}px`);
    console.log(`PASS tampilan ${width}px, tinggi ${metrics.height}px, tanpa overflow`);
    if (width === 1280 || width === 390) {
      await evaluate('(async () => { for (let top = 0; top < document.documentElement.scrollHeight; top += 650) { scrollTo({top, behavior: "instant"}); await new Promise(resolve => setTimeout(resolve, 35)); } scrollTo({top: 0, behavior: "instant"}); })()');
      await pause(1150);
      const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: metrics.height, scale: 1 } });
      fs.writeFileSync(path.join(previews, width === 1280 ? 'desktop.png' : 'mobile.png'), Buffer.from(screenshot.data, 'base64'));
      if (width === 1280) {
        const hero = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width, height: 900, scale: 1 } });
        fs.writeFileSync(path.join(previews, 'hero.png'), Buffer.from(hero.data, 'base64'));
      }
    }
  }
  await evaluate('document.querySelector(".menu-toggle").click()');
  assert(await evaluate('document.querySelector(".menu-toggle").getAttribute("aria-expanded") === "true" && getComputedStyle(document.querySelector("#navigasi")).display !== "none"'), 'Menu HP tidak terbuka');
  await evaluate('document.querySelector(".nav-links a").click()');
  assert(await evaluate('document.querySelector(".menu-toggle").getAttribute("aria-expanded") === "false"'), 'Menu HP tidak menutup');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  assert(await evaluate('document.querySelector(".faq summary .faq-triangle").checkVisibility()'), 'Segitiga tidak terlihat saat FAQ tertutup');
  await evaluate('document.querySelectorAll(".faq summary")[0].click()');
  await pause(100);
  assert(await evaluate('document.querySelector(".faq-triangle").getAnimations().length === 1 && getComputedStyle(document.querySelector(".faq details")).overflow === "visible"'), 'Animasi segitiga FAQ tidak terlihat');
  assert(await evaluate('document.querySelectorAll(".faq details")[0].open'), 'FAQ tidak terbuka');
  await evaluate('document.querySelectorAll(".faq summary")[1].click()');
  await pause(550);
  assert(await evaluate('!document.querySelectorAll(".faq details")[0].open && document.querySelectorAll(".faq details")[1].open'), 'Accordion FAQ tidak berganti');
  await evaluate('document.querySelectorAll(".faq summary")[1].click(); document.querySelectorAll(".faq summary")[1].click()');
  await pause(550);
  assert(await evaluate('document.querySelectorAll(".faq details")[1].open && document.querySelectorAll(".faq summary")[1].getAttribute("aria-expanded") === "true"'), 'FAQ gagal setelah klik cepat');
  await pause(100);
  assert(await evaluate('document.querySelectorAll(".faq-triangle")[1].getAnimations().length === 0'), 'Segitiga FAQ tidak berhenti');
  for (const key of ['masuk', 'kontak', 'chat', 'dokumen', 'statistik']) {
    await evaluate(`document.querySelector('[data-info="${key}"]').click()`);
    assert(await evaluate('document.querySelector("#info-dialog").open && document.querySelector("#dialog-title").textContent.length > 0'), `Dialog ${key} gagal`);
    await evaluate('document.querySelector(".dialog-done").click()');
    assert(await evaluate('!document.querySelector("#info-dialog").open'), 'Dialog tidak menutup');
  }
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await evaluate('window.scrollTo({top: 0, behavior: "instant"})');
  await pause(150);
  const firstPoster = await evaluate('document.querySelector(\'.poster[data-slot="0"]\').alt');
  const galleryPoint = await evaluate('(() => { const r = document.querySelector(".poster-gallery").getBoundingClientRect(); return {x: r.left + r.width / 2, y: r.top + r.height / 2}; })()');
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...galleryPoint });
  await pause(4400);
  assert(await evaluate('document.querySelector(\'.poster[data-slot="0"]\').alt') !== firstPoster, 'Pergantian otomatis gagal');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await pause(100);
  assert(await evaluate('getComputedStyle(document.querySelector(".poster")).transitionDuration === "0s"'), 'Preferensi reduced motion tidak dihormati');
  const reducedPoster = await evaluate('document.querySelector(\'.poster[data-slot="0"]\').alt');
  await pause(4400);
  assert(await evaluate('document.querySelector(\'.poster[data-slot="0"]\').alt') === reducedPoster, 'Poster tidak berhenti saat reduced motion');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  for (const width of [1280, 390]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
    await pause(100);
    assert(await evaluate('Array.from(document.querySelectorAll(".timeline-rail")).every(rail => { const style = getComputedStyle(rail, "::before"); return style.borderRadius === "50%" && style.width === style.height && style.transform === "none"; })'), 'Ujung timeline belum berbentuk lingkaran');
    for (const fraction of [0.7, 0.25]) {
      await evaluate(`(() => { const rail = document.querySelector('.timeline-rail'); const box = rail.getBoundingClientRect(); const css = getComputedStyle(rail); const start = parseFloat(css.getPropertyValue('--rail-start')); const end = parseFloat(css.getPropertyValue('--rail-end')); scrollTo({top: scrollY + box.top + start + (box.height - start - end) * ${fraction} - innerHeight * .58, behavior: 'instant'}); })()`);
      await pause(120);
      const progress = await evaluate('parseFloat(document.querySelector(".timeline-rail").style.getPropertyValue("--rail-progress"))');
      assert(Math.abs(progress - fraction) < 0.015, `Garis timeline tidak mengikuti scroll pada ${width}px: ${progress} vs ${fraction}`);
      assert(await evaluate('document.querySelector(".timeline-rail").classList.contains("is-tracking")'), 'Penanda aktif tidak tampil');
      const pointerError = await evaluate('(() => { const rail = document.querySelector(".timeline-rail"); const fill = rail.querySelector(".timeline-fill").getBoundingClientRect(); const dot = rail.querySelector(".timeline-cursor").getBoundingClientRect(); return Math.abs(fill.bottom - dot.top - dot.height / 2); })()');
      assert(pointerError < 2, `Penanda tidak berada di ujung garis: ${pointerError}`);
    }
    console.log(`PASS timeline maju/mundur dan penanda scroll ${width}px`);
  }
  console.log('PASS segitiga FAQ berputar sekali, poster otomatis tanpa kontrol, dan reduced motion.');
  assert(!errors.length, `JavaScript error: ${JSON.stringify(errors)}`);
  console.log('PASS menu HP, accordion FAQ, 5 dialog, semua aset lokal, tanpa error JavaScript.');
  console.log('Screenshot tersimpan di previews/desktop.png dan previews/mobile.png');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (ws && ws.readyState === WebSocket.OPEN) { try { await send('Browser.close', {}, null); } catch {} ws.close(); }
  browser.kill();
});
