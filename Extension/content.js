/* ===================================
   FOCUSTUBE CONTENT (OPTIMIZED)
=================================== */

let FOCUS_TOPIC = "";
let POMODORO_MODE = "idle";
let sessionInvalidSent = false;

/* ========= LOAD SESSION ========= */

chrome.storage.sync.get(["focusTopic", "pomodoroMode"], (res) => {
  FOCUS_TOPIC = (res.focusTopic || "").toLowerCase();
  POMODORO_MODE = res.pomodoroMode || "idle";
  enforce();
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.focusTopic)
    FOCUS_TOPIC = changes.focusTopic.newValue.toLowerCase();

  if (changes.pomodoroMode) {
    POMODORO_MODE = changes.pomodoroMode.newValue;
    if (POMODORO_MODE !== "focus") {
      sessionInvalidSent = false;
    }
  }
  enforce();
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
    await fetch("http://localhost:5000/api/sessions/invalid", {
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
    document.querySelector("h1 yt-formatted-string")?.innerText.toLowerCase() || "";

  if (!title.includes(FOCUS_TOPIC)) {
    markInvalidSession();
    blockPage("Blocked: Out-of-scope video");
  } else {
    unblockPage();
  }
}

function enforceSearch() {
  const query = getQuery();

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
    justify-content:center;
    align-items:center;
    font-size:22px;
    z-index:999999;
  `;
  overlay.innerText = message;
  document.body.appendChild(overlay);
}

function unblockPage() {
  const o = document.getElementById("focus-overlay");
  if (o) o.remove();
}

/* ========= MAIN ENFORCE ========= */

function enforce() {

  if (!FOCUS_TOPIC) return;


  if (isHome()) {
    blockPage("Homepage Disabled");
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

  unblockPage();
}

/* ========= YT NAVIGATION LISTENER ========= */

document.addEventListener("yt-navigate-finish", () => {
  setTimeout(enforce, 500);
});

/* Initial */
setTimeout(enforce, 1000);