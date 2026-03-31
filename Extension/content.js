/* ===================================
   FOCUSTUBE CONTENT (OPTIMIZED)
=================================== */

let FOCUS_TOPIC = "";
let POMODORO_MODE = "idle";
let sessionInvalidSent = false;



chrome.storage.sync.get(["focusTopic", "pomodoroMode"], (res) => {

  FOCUS_TOPIC = (res.focusTopic || "").toLowerCase();
  POMODORO_MODE = res.pomodoroMode || "idle";

  enforce();
});

/* ========= LOAD SESSION ========= */
let debounce;

const observer = new MutationObserver(() => {

  clearTimeout(debounce);

  debounce = setTimeout(() => {

    if (!chrome?.storage?.sync) return;

    applySettings();

  }, 700);

});

observer.observe(document.body, {
  childList: true,
  subtree: true
});


// Hide Shorts
function toggleShorts(enable) {

  const isShortsPage = location.pathname.startsWith("/shorts");

  if (isShortsPage && enable) {
    blockPage("Shorts are blocked during focus mode");
    return;
  }

  document.querySelectorAll("ytd-reel-shelf-renderer")
    .forEach(el => {
      el.style.display = enable ? "none" : "";
    });

}

// Hide Home Feed
function toggleHome(enable) {

  const homeFeed = document.querySelector("ytd-rich-grid-renderer");

  if (!homeFeed) return;

  if (enable) {
    homeFeed.style.display = "none";
  } else {
    homeFeed.style.display = enable ? "none" : "grid";
  }

}

// Hide Sidebar
function toggleSidebar(enable) {

  const guide = document.querySelector("ytd-guide-renderer");
  const miniGuide = document.querySelector("ytd-mini-guide-renderer");

  if (guide) {
    guide.style.display = enable ? "none" : "block";
  }

  if (miniGuide) {
    miniGuide.style.display = enable ? "none" : "flex";
  }

}


// Hide Comments
function toggleComments(enable) {

  const comments = document.querySelector("ytd-comments");

  if (comments) {
    comments.style.display = enable ? "none" : "";
  }

}

// Hide Recommendations
function toggleRecommendations(enable) {

  const rec = document.querySelector("#related");

  if (rec) {
    rec.style.display = enable ? "none" : "";
  }

}

function applySettings() {

  if (!chrome?.storage?.sync) return; // 🔥 FIX

  chrome.storage.sync.get([
    "hideShorts",
    "hideHome",
    "hideComments",
    "hideRecommendations",
    "hideSidebar"
  ], (res) => {

    if (!res) return;

    toggleShorts(res.hideShorts);
    toggleHome(res.hideHome);
    toggleComments(res.hideComments);
    toggleRecommendations(res.hideRecommendations);
    toggleSidebar(res.hideSidebar);


  });
}

window.addEventListener("load", applySettings);



chrome.storage.onChanged.addListener((changes) => {
  if (changes.focusTopic) {
    FOCUS_TOPIC = (changes.focusTopic.newValue || "").toLowerCase();
  }

  if (changes.pomodoroMode) {
    POMODORO_MODE = changes.pomodoroMode.newValue;
  }

  if (changes.hideShorts) {
    toggleShorts(changes.hideShorts.newValue);
  }

  if (changes.hideHome) {
    toggleHome(changes.hideHome.newValue);
  }

  if (changes.hideComments) {
    toggleComments(changes.hideComments.newValue);
  }

  if (changes.hideRecommendations) {
    toggleRecommendations(changes.hideRecommendations.newValue);
  }

  if (changes.hideSidebar) {
    toggleSidebar(changes.hideSidebar.newValue);
  }


});


/* ========= PAGE HELPERS ========= */
function isWatch() { return location.pathname === "/watch"; }
function isSearch() { return location.pathname === "/results"; }
function isHome() { return location.pathname === "/"; }

function getQuery() {
  const p = new URLSearchParams(location.search);
  return (p.get("search_query") || "").toLowerCase();
}

/* ========= INVALID SESSION (SAFE) ========= */

async function markInvalidSession() {
  if (sessionInvalidSent) return;

  sessionInvalidSent = true;

  const { sessionId } = await chrome.storage.sync.get("sessionId");
  if (!sessionId) return;

  try {
    await fetch("https://focustube-college-server.onrender.com/api/sessions/invalid", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId })
    });
  } catch (err) {
    console.log("Invalid error:", err);
  }
}

/* ========= ENFORCEMENT ========= */

function enforceWatch() {

  const title =
    document.querySelector("h1 yt-formatted-string")
      ?.innerText.toLowerCase() || "";

  if (!FOCUS_TOPIC) return;

  if (!title.includes(FOCUS_TOPIC)) {
    blockPage("Blocked: Out-of-scope video");
  } else {
    unblockPage();
  }

}

function enforceSearch() {

  const query = getQuery();

  if (!FOCUS_TOPIC) return;

  if (!query.includes(FOCUS_TOPIC)) {
    blockPage("Unrelated search blocked");
  } else {
    unblockPage();
  }

}

function blockPage(message) {

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
    flex-direction:column;
    justify-content:center;
    align-items:center;
    font-size:22px;
    z-index:999999;
    text-align:center;
  `;

  overlay.innerHTML = `
    <div>${message}</div>
    <div style="margin-top:10px;font-size:16px;color:#aaa;">
      Topic: ${FOCUS_TOPIC || "Not Set"}
    </div>
    <div style="margin-top:5px;font-size:14px;color:#00ff99;">
      Mode: ${POMODORO_MODE}
    </div>
  `;

  document.body.appendChild(overlay);
}

function unblockPage() {
  const o = document.getElementById("focus-overlay");
  if (o) o.remove();
}

/* ========= MAIN ENFORCE ========= */

function enforce() {
  unblockPage();

  if (location.pathname.startsWith("/shorts") && FOCUS_TOPIC) {
    blockPage("Shorts are blocked during focus mode");
    return;
  }

  // ===== CASE 1: NO SESSION =====
  if (!FOCUS_TOPIC) {
    unblockPage();

    return;
  }

  // ===== CASE 2: HOME PAGE =====
  if (isHome()) {
    if (POMODORO_MODE === "focus") {
      blockPage("Focus session active"); // only block during focus
    } else {
      unblockPage(); // 🔥 allow toggles to control UI
    }

    return;
  }

  // ===== CASE 3: SEARCH =====
  if (isSearch()) {
    enforceSearch();
    return;
  }

  // ===== CASE 4: VIDEO =====
  if (isWatch()) {
    enforceWatch();
    return;
  }

  unblockPage();
}

/* ========= YT NAVIGATION LISTENER ========= */

document.addEventListener("yt-navigate-finish", () => {
  setTimeout(() => {
    enforce();
    applySettings();
  }, 1000);
});

/* Initial */
setTimeout(enforce, 1000);