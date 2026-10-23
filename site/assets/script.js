"use strict";
/* Earthed — رفتار صفحه. همه‌ی فهرست‌ها از data.js کشیده می‌شوند. */

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const NS = "http://www.w3.org/2000/svg";
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- کسب‌وکار ---------- */
$("#brandName").textContent = BUSINESS.name;
$("#brandPhone").textContent = BUSINESS.phone;
$("#brandPhone").href = "tel:" + BUSINESS.phoneRaw;
$("#footName").textContent = BUSINESS.name;
$("#footArea").textContent = BUSINESS.area;
$("#footPhone").textContent = BUSINESS.phone;
$("#footEmail").textContent = BUSINESS.email;
$("#vanName").textContent = BUSINESS.name;

/* ---------- خدمات ---------- */
const PICTURES = {
  board: "<svg viewBox='0 0 64 64' fill='none' stroke='currentColor' stroke-width='2'><rect x='14' y='8' width='36' height='48' rx='3'/><rect x='20' y='15' width='10' height='14' rx='1'/><rect x='34' y='15' width='10' height='14' rx='1'/><rect x='20' y='34' width='10' height='14' rx='1'/><rect x='34' y='34' width='10' height='14' rx='1'/><line x1='25' y1='20' x2='25' y2='26'/><line x1='39' y1='20' x2='39' y2='26'/></svg>",
  wall: "<svg viewBox='0 0 64 64' fill='none' stroke='currentColor' stroke-width='2'><rect x='10' y='12' width='44' height='40' rx='2'/><circle cx='32' cy='32' r='6'/><circle cx='29' cy='31' r='1.4' fill='currentColor'/><circle cx='35' cy='31' r='1.4' fill='currentColor'/><path d='M10 52 L54 52'/></svg>",
  car: "<svg viewBox='0 0 64 64' fill='none' stroke='currentColor' stroke-width='2'><path d='M8 42 L10 30 Q11 26 16 26 L24 16 Q26 14 30 14 L42 14 Q47 14 49 18 L53 26 L56 28 Q59 29 59 33 L59 42 Z'/><circle cx='19' cy='44' r='5'/><circle cx='45' cy='44' r='5'/><path d='M38 6 L30 11 L36 12 L28 18' stroke-linejoin='round'/></svg>",
  bulb: "<svg viewBox='0 0 64 64' fill='none' stroke='currentColor' stroke-width='2'><circle cx='32' cy='26' r='14'/><path d='M27 40 L27 46 L37 46 L37 40 M27 50 L37 50'/><path d='M32 8 L32 4 M14 26 L10 26 M54 26 L50 26 M19 13 L16 10 M48 13 L45 10'/></svg>",
  tester: "<svg viewBox='0 0 64 64' fill='none' stroke='currentColor' stroke-width='2'><rect x='14' y='8' width='36' height='48' rx='4'/><rect x='20' y='14' width='24' height='14' rx='2'/><circle cx='26' cy='38' r='4'/><circle cx='38' cy='38' r='4'/><path d='M20 48 L44 48'/></svg>",
  report: "<svg viewBox='0 0 64 64' fill='none' stroke='currentColor' stroke-width='2'><rect x='16' y='8' width='32' height='48' rx='3'/><path d='M23 20 L41 20 M23 28 L41 28 M23 36 L41 36'/><path d='M24 46 L29 51 L40 41'/></svg>",
};

const servicesList = $("#servicesList");
SERVICES.forEach(s => {
  const art = document.createElement("article");
  art.className = "service";
  const h = document.createElement("h3");
  h.textContent = s.title;
  const p = document.createElement("p");
  p.textContent = s.text;
  const body = document.createElement("div");
  body.append(h, p);
  art.innerHTML = PICTURES[s.picture] || PICTURES.board;
  art.append(body);
  servicesList.append(art);
});

/* ---------- خانه‌ی بزرگ: کلید و سیم‌ها ---------- */
const heroSvg = $("#heroHouse");
const cableLayer = $("#cables");
const cables = GEOMETRY.heroCables.map(cfg => {
  const path = document.createElementNS(NS, "path");
  path.setAttribute("class", "cable");
  path.setAttribute("d", cfg.d);
  cableLayer.append(path);
  return { cfg, path };
});

let powerOn = false;
const masterSwitch = $("#masterSwitch");
const switchLabel = masterSwitch.querySelector(".switch-label");

function lightRoom(id) {
  const room = $(`.room[data-room="${id}"]`, heroSvg);
  if (room) room.classList.add("lit");
}

function turnOn() {
  if (powerOn) return;
  powerOn = true;
  masterSwitch.classList.add("on");
  masterSwitch.setAttribute("aria-pressed", "true");
  switchLabel.textContent = "روشن";
  $("#switchHint").textContent = "جریان رسید؛ روی هر اتاق بایستید";

  if (REDUCED) {
    cables.forEach(({ cfg, path }) => {
      path.style.strokeDashoffset = 0;
      lightRoom(cfg.room);
    });
    return;
  }
  let at = 0;
  for (const { cfg, path } of cables) {
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    const dur = cfg.ms;
    setTimeout((p => () => {
      p.style.transition = `stroke-dashoffset ${dur}ms linear`;
      p.style.strokeDashoffset = 0;
      setTimeout(() => lightRoom(cfg.room), dur);
    })(path), at);
    at += Math.round(dur * 0.45);
  }
}
masterSwitch.addEventListener("click", turnOn);
/* اگر کاری نداشته باشید، کلید خودش می‌پرد تا همه جریان را ببینند */
setTimeout(turnOn, REDUCED ? 100 : 1400);

/* اسم و مدار هر اتاق */
const scene = $(".hero-scene");
const tip = $("#roomTip");
function showTip(room) {
  const info = ROOM_CIRCUITS[room.dataset.room];
  if (!info) return;
  tip.innerHTML = `<strong>${info.name}</strong><ul>` +
    info.circuits.map(c => `<li>${c}</li>`).join("") + "</ul>";
  tip.hidden = false;
  const r = room.getBoundingClientRect();
  const s = scene.getBoundingClientRect();
  const x = r.left - s.left + r.width / 2 - tip.offsetWidth / 2;
  tip.style.left = Math.max(4, Math.min(x, s.width - tip.offsetWidth - 4)) + "px";
  tip.style.top = Math.max(4, r.top - s.top - tip.offsetHeight - 8) + "px";
}
$$(".room", heroSvg).forEach(room => {
  room.addEventListener("pointerenter", () => showTip(room));
  room.addEventListener("pointerleave", () => { tip.hidden = true; });
  /* لمس روی صفحه‌لمسی هم اسم مدارها را می‌آورد */
  room.addEventListener("click", () => showTip(room));
});

/* ---------- تابلوی برق و خانه‌ی کوچک ---------- */
const bank = $("#breakerBank");
CIRCUITS.forEach((c, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const g = document.createElementNS(NS, "g");
  g.setAttribute("class", "breaker");
  g.setAttribute("transform", `translate(${16 + col * 112}, ${42 + row * 54})`);
  g.setAttribute("tabindex", "0");
  g.setAttribute("role", "switch");
  g.setAttribute("aria-checked", "true");
  g.setAttribute("aria-label", c.label);
  g.innerHTML = `<rect class="body" width="96" height="44" rx="4"></rect>
    <rect class="lever" x="10" y="9" width="34" height="12" rx="2"></rect>
    <text x="78" y="28" text-anchor="middle">${c.rating}</text>`;
  const toggle = () => {
    c.off = !c.off;
    g.classList.toggle("off", c.off);
    g.setAttribute("aria-checked", String(!c.off));
    applyCircuits();
  };
  g.addEventListener("click", toggle);
  g.addEventListener("keydown", e => {
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggle(); }
  });
  bank.append(g);
});

function applyCircuits() {
  const dark = new Set();
  const offTexts = [];
  CIRCUITS.forEach(c => {
    if (c.off) {
      offTexts.push(c.offText);
      c.rooms.forEach(r => dark.add(r));
    }
  });
  $$(".mini-room").forEach(r => r.classList.toggle("dark", dark.has(r.dataset.room)));
  $("#boardStatus").textContent = offTexts.length
    ? offTexts.join(" ")
    : "همه مدارها وصل‌اند؛ خانه کامل روشن است.";
}
applyCircuits();

/* ---------- دیوار و مراحل کار ---------- */
const wallStages = $$(".wall-stage");
let testTimer = null;
function runTester(stage) {
  const screen = $("#testerScreen");
  clearInterval(testTimer);
  if (stage < 4) { screen.textContent = "آماده"; return; }
  if (REDUCED) { screen.textContent = "همه‌ی تست‌ها پاس شد"; return; }
  let i = 0;
  screen.textContent = TESTS[0];
  testTimer = setInterval(() => {
    i += 1;
    if (i >= TESTS.length) {
      clearInterval(testTimer);
      screen.textContent = "همه‌ی تست‌ها پاس شد";
      return;
    }
    screen.textContent = TESTS[i];
  }, 750);
}
function setWallStage(n) {
  wallStages.forEach(s => s.classList.toggle("show", Number(s.dataset.stage) === n));
  runTester(n);
}

const stepsList = $("#stepsList");
const FA_DIGITS = ["۱", "۲", "۳", "۴"];
STEPS.forEach((s, i) => {
  const art = document.createElement("article");
  art.className = "step";
  art.dataset.stage = s.stage;
  const tag = document.createElement("p");
  tag.className = "stage-tag";
  tag.textContent = `مرحله ${FA_DIGITS[i]} از ۴`;
  const h = document.createElement("h3");
  h.textContent = s.title;
  const p = document.createElement("p");
  p.textContent = s.text;
  art.append(tag, h, p);
  stepsList.append(art);
});
setWallStage(1);
const stepIO = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    setWallStage(Number(en.target.dataset.stage));
    $$(".step").forEach(s => s.classList.toggle("active", s === en.target));
  });
}, { threshold: 0.55 });
$$(".step").forEach(s => stepIO.observe(s));

/* ---------- ون و شهرها ---------- */
const towns = $("#towns");
AREAS.forEach(a => {
  const s = document.createElement("span");
  s.textContent = a;
  towns.append(s);
});
const strip = $("#vanStrip");
const van = $("#van");
function moveVan() {
  const r = strip.getBoundingClientRect();
  const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (innerHeight * 0.85 + r.height * 0.5)));
  const dist = strip.clientWidth - van.getBoundingClientRect().width - 8;
  van.style.transform = `translateX(${-p * dist}px)`;
}
addEventListener("scroll", moveVan, { passive: true });
addEventListener("resize", moveVan);
moveVan();

/* ---------- پایان صفحه: خانه تاریک، جز راه‌رو ---------- */
const endHouse = $("#endHouse");
new IntersectionObserver(entries => {
  endHouse.classList.toggle("night", entries[0].isIntersecting);
}, { threshold: 0.4 }).observe(endHouse);

/* ---------- فرم درخواست ---------- */
$("#requestForm").addEventListener("submit", async e => {
  e.preventDefault();
  const btn = $("#sendSwitch");
  btn.classList.add("on");
  btn.setAttribute("aria-pressed", "true");
  btn.querySelector(".switch-label").textContent = "ارسال شد";
  const note = $("#formNote");
  note.className = "form-note";
  if (!STORE.requestUrl) {
    note.classList.add("warn");
    note.textContent = "چیزی ارسال نشد — هنوز آدرسی برای دریافت درخواست‌ها تعیین نشده است. requestUrl را در assets/data.js تنظیم کنید تا فرم واقعاً ارسال شود.";
    return;
  }
  try {
    const res = await fetch(STORE.requestUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(e.target))),
    });
    if (!res.ok) throw new Error("bad status");
    note.classList.add("ok");
    note.textContent = "درخواست شما ارسال شد؛ به‌زودی با شما تماس می‌گیریم.";
  } catch {
    note.classList.add("warn");
    note.textContent = "ارسال ناموفق بود؛ لطفاً دوباره تلاش کنید یا تلفنی تماس بگیرید.";
  }
});
