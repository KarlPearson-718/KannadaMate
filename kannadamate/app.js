// ---------- tiny storage helpers ----------
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const state = {
  lang: load("lang", null),          // "en" or "hi"
  review: load("review", []),        // list of Kannada phrases to review
  done: load("done", 0),             // number of phrases practised
  streak: load("streak", { days: 0, last: "" }),
  tab: "learn", lesson: null, rp: "start", card: 0
};
const app = document.getElementById("app");
const ALL = LESSONS.flatMap(l => l.phrases);
const meaning = p => p[state.lang] || p.en;

// ---------- streak ----------
(function touchStreak() {
  const today = new Date().toDateString();
  if (state.streak.last === today) return;
  const y = new Date(Date.now() - 864e5).toDateString();
  state.streak.days = state.streak.last === y ? state.streak.days + 1 : 1;
  state.streak.last = today; save("streak", state.streak);
})();

// ---------- audio (browser text-to-speech) ----------
function speak(text) {
  if (!("speechSynthesis" in window)) return alert("Audio not supported on this device.");
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "kn-IN"; u.rate = 0.8;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}

// ---------- pronunciation scoring ----------
function lev(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
  return d[a.length][b.length];
}
const norm = s => s.toLowerCase().replace(/[\s.,?!]/g, "");
function score(heard, target) {
  const a = norm(heard), b = norm(target);
  return Math.round((1 - lev(a, b) / Math.max(a.length, b.length, 1)) * 100);
}
function listen(target, out) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { out.innerHTML = "Speech check isn't supported here. Play the audio, say it aloud, then judge yourself 👇"; return; }
  const r = new SR(); r.lang = "kn-IN";
  out.textContent = "🎙️ Listening… speak now";
  r.onresult = e => {
    const heard = e.results[0][0].transcript, s = score(heard, target);
    const [cls, msg] = s > 80 ? ["good", "Good! ✅"] : s >= 50 ? ["almost", "Almost — try again"] : ["retry", "Try again"];
    out.innerHTML = `<b class="${cls}">${msg} (${s}%)</b><br>Heard: ${heard}`;
    if (s > 80) { state.done++; save("done", state.done); header(); }
  };
  r.onerror = () => out.textContent = "Couldn't hear that. Check mic permission and try again.";
  r.start();
}

// ---------- views ----------
function header() { document.getElementById("streak").textContent = `🔥 ${state.streak.days}-day streak · ${state.done} ✔`; }
function nav() {
  const tabs = [["learn", "Learn"], ["practice", "Practice"], ["apply", "Role-play"], ["review", "Review"]];
  document.getElementById("nav").innerHTML = tabs.map(([id, t]) =>
    `<button class="${state.tab === id ? "on" : ""}" onclick="go('${id}')">${t}</button>`).join("");
}
function go(t) { state.tab = t; state.lesson = null; state.rp = "start"; render(); }

function phraseCard(p, extra = "") {
  const i = ALL.indexOf(p);
  return `<div class="card"><p class="kn">${p.kn}</p><p class="tr">${p.tr}</p><p class="mean">${meaning(p)}</p>
    <button class="btn" onclick="speak(ALL[${i}].kn)">🔊 Listen</button>${extra}</div>`;
}
function onboarding() {
  app.innerHTML = `<div class="card"><h2>Welcome! 🙏</h2><p>Choose your language for meanings:</p>
    <button class="btn" onclick="setLang('en')">English</button>
    <button class="btn" onclick="setLang('hi')">हिन्दी</button></div>`;
}
function setLang(l) { state.lang = l; save("lang", l); render(); }

function learn() {
  if (!state.lesson) {
    app.innerHTML = "<h2>Pick a situation</h2>" + LESSONS.map(l =>
      `<div class="card"><b>${l.title}</b> (${l.phrases.length} phrases)<br>
       <button class="btn" onclick="state.lesson='${l.id}';render()">Open</button></div>`).join("");
    return;
  }
  const l = LESSONS.find(x => x.id === state.lesson);
  app.innerHTML = `<button class="btn alt" onclick="state.lesson=null;render()">← Back</button><h2>${l.title}</h2>` +
    l.phrases.map(p => phraseCard(p,
      `<button class="btn alt" onclick="addReview(ALL.indexOf(ALL[${ALL.indexOf(p)}]))">⭐ Save for review</button>`)).join("");
}
function addReview(i) {
  const k = ALL[i].kn;
  if (!state.review.includes(k)) { state.review.push(k); save("review", state.review); }
  alert("Saved to Review ⭐");
}

function practice() {
  const p = ALL[state.card % ALL.length];
  app.innerHTML = `<h2>Say it aloud</h2>${phraseCard(p,
    `<button class="btn" onclick="listen('${p.kn}', document.getElementById('out'))">🎤 Record</button>
     <button class="btn alt" onclick="selfOk()">I said it well</button>
     <div id="out" style="margin-top:10px"></div>`)}
    <button class="btn alt" onclick="state.card++;render()">Next phrase →</button>`;
}
function selfOk() { state.done++; save("done", state.done); header(); state.card++; render(); }

function roleplay() {
  const n = ROLEPLAY[state.rp];
  app.innerHTML = `<h2>🛺 Talk to the auto driver</h2>
    <div class="bubble"><b>${n.kn}</b><br>${n.tr}<br><i>${n.en}</i>
      <br><button class="btn" onclick="speak('${n.kn}')">🔊</button></div>` +
    (n.end ? `<div class="card">🎉 Ride started! You spoke Kannada.<br>
      <button class="btn" onclick="state.rp='start';render()">Play again</button></div>` :
    n.choices.map((c, i) => `<div class="card"><b>${c.kn}</b><br>${c.tr}<br><i>${c.en}</i><br>
      <button class="btn" onclick="state.rp=ROLEPLAY['${state.rp}'].choices[${i}].next;render()">Say this</button></div>`).join(""));
}

function review() {
  const list = ALL.filter(p => state.review.includes(p.kn));
  app.innerHTML = "<h2>Review ⭐</h2>" + (list.length
    ? list.map(p => `<div class="card" onclick="this.querySelector('.ans').hidden=false">
        <p class="kn">${p.kn}</p><button class="btn" onclick="event.stopPropagation();speak('${p.kn}')">🔊</button>
        <div class="ans" hidden><p class="tr">${p.tr}</p><p class="mean">${meaning(p)}</p></div>
        <small>Tap card to reveal</small></div>`).join("")
    : "<p>No saved phrases yet. Tap ⭐ in a lesson.</p>");
}

function render() {
  header(); nav();
  if (!state.lang) return onboarding();
  ({ learn, practice, apply: roleplay, review })[state.tab]();
}
render();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
