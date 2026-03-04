/* =============================
   FOCUSTUBE STABLE VERSION
============================= */

let FOCUS_TOPIC = "";
let POMODORO_MODE = "idle";

/* LOAD SETTINGS */
chrome.storage.sync.get(["focusTopic", "pomodoroMode"], (res) => {
  FOCUS_TOPIC = (res.focusTopic || "").toLowerCase();
  POMODORO_MODE = res.pomodoroMode || "idle";
  enforce();
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.focusTopic) {
    FOCUS_TOPIC = changes.focusTopic.newValue.toLowerCase();
  }
  if (changes.pomodoroMode) {
    POMODORO_MODE = changes.pomodoroMode.newValue;
  }
  enforce();
});

/* ================= UTILITIES ================= */

function hideMain() {
  const page = document.querySelector("ytd-page-manager");
  if (page) page.style.display = "none";
}

function showMain() {
  const page = document.querySelector("ytd-page-manager");
  if (page) page.style.display = "";
}

function showOverlay(message) {
  if (document.getElementById("focus-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "focus-overlay";
  overlay.style.cssText = `
    position:fixed;
    top:56px;
    left:0;
    right:0;
    bottom:0;
    background:black;
    color:white;
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:column;
    font-size:22px;
    z-index:999999;
  `;
  overlay.innerHTML = `
    <div>${message}</div>
    <div style="opacity:.6;margin-top:10px;">
      Topic: ${FOCUS_TOPIC}
    </div>
    <div style="color:#00ff99;margin-top:5px;">
      Mode: ${POMODORO_MODE}
    </div>
  `;
  document.body.appendChild(overlay);
}

function removeOverlay() {
  const o = document.getElementById("focus-overlay");
  if (o) o.remove();
}

/* ================= HAMBURGER HARD DISABLE ================= */

function killHamburger() {
  const btn = document.querySelector("#guide-button");
  if (btn) {
    btn.style.display = "none";
    btn.onclick = (e) => e.stopPropagation();
  }

  const guide = document.querySelector("ytd-guide-renderer");
  if (guide) guide.style.display = "none";

  const mini = document.querySelector("ytd-mini-guide-renderer");
  if (mini) mini.style.display = "none";
}

/* ================= PAGE CHECK ================= */

function isHome() { return location.pathname === "/"; }
function isSearch() { return location.pathname === "/results"; }
function isWatch() { return location.pathname === "/watch"; }
function isShorts() { return location.pathname.startsWith("/shorts"); }

function getQuery() {
  const p = new URLSearchParams(location.search);
  return (p.get("search_query") || "").toLowerCase();
}

/* ================= ENFORCEMENT ================= */

function enforceWatch() {

  const title =
    document.querySelector("h1 yt-formatted-string")?.innerText.toLowerCase() || "";

  const video = document.querySelector("video");

  if (!title.includes(FOCUS_TOPIC)) {

    if (video) {
      video.pause();
      video.currentTime = 0;
      video.addEventListener("play", () => {
        video.pause();
        video.currentTime = 0;
      });
    }

    hideMain();
    showOverlay("Blocked: Out-of-scope video");

  } else {
    showMain();
    removeOverlay();
  }
}

function enforceSearch() {
  const query = getQuery();

  if (!query.includes(FOCUS_TOPIC)) {
    hideMain();
    showOverlay("Unrelated search blocked");
  } else {
    showMain();
    removeOverlay();
  }
}

function enforce() {

  killHamburger();

  if (!FOCUS_TOPIC) return;

  if (POMODORO_MODE === "break") {
    showMain();
    removeOverlay();
    return;
  }

  if (isShorts()) {
    hideMain();
    showOverlay("Shorts Disabled");
    return;
  }

  if (isHome()) {
    hideMain();
    showOverlay("Homepage Disabled");
    return;
  }

  if (isSearch()) {
    enforceSearch();
    return;
  }

  if (isWatch()) {
    enforceWatch();
    return;
  }

  showMain();
  removeOverlay();
}

/* ================= SPA DETECTION ================= */

/* Detect YouTube navigation properly */
document.addEventListener("yt-navigate-finish", () => {
  setTimeout(enforce, 700);
});

/* Backup observer (lightweight) */
const observer = new MutationObserver(() => {
  killHamburger();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

/* Initial run */
setTimeout(enforce, 1000);