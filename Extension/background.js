/* ===================================
   FOCUSTUBE BACKGROUND (TIMESTAMP TIMER)
=================================== */

/* ========= COMPLETE SESSION ========= */

async function completeSession() {

  const { sessionId } = await chrome.storage.sync.get("sessionId");
  if (!sessionId) return;

  try {

    await fetch("http://localhost:5000/api/sessions/complete", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId })
    });

  } catch (err) {

    console.log("Complete error:", err);

  }

}

/* ========= START FOCUS ========= */

async function startFocus() {

  const startTimestamp = Date.now();
  const focusLength = 2 * 60 * 1000;

  await chrome.storage.sync.set({
    pomodoroMode: "focus",
    startTimestamp,
    focusLength
  });

}

/* ========= START BREAK ========= */

async function startBreak() {

  const startTimestamp = Date.now();
  const focusLength = 5 * 60 * 1000;

  await chrome.storage.sync.set({
    pomodoroMode: "break",
    startTimestamp,
    focusLength
  });

}

/* ========= TIMER CHECK ========= */

async function runTimer() {

  const { startTimestamp, focusLength, pomodoroMode } =
    await chrome.storage.sync.get([
      "startTimestamp",
      "focusLength",
      "pomodoroMode"
    ]);

  if (!startTimestamp || !focusLength) return;

  const elapsed = Date.now() - startTimestamp;
  const remaining = focusLength - elapsed;

  if (remaining <= 0) {

    if (pomodoroMode === "focus") {

      await completeSession();
      await startBreak();

    } else {

      await chrome.storage.sync.set({
        pomodoroMode: "idle",
        startTimestamp: null,
        focusLength: null
      });

    }

    return;

  }

  const secondsLeft = Math.floor(remaining / 1000);

  await chrome.storage.sync.set({
    pomodoroTimeLeft: secondsLeft
  });

}

/* ========= STOP TIMER ========= */

async function stopTimer() {

  await chrome.storage.sync.set({
    pomodoroMode: "idle",
    startTimestamp: null,
    focusLength: null,
    pomodoroTimeLeft: 0
  });

}


async function syncSettings() {

  try {

    const res = await fetch(
      "http://localhost:5000/api/settings",
      {
        credentials: "include"
      }
    );

    const data = await res.json();

    chrome.storage.sync.set({
      hideShorts: data.settings.hideShorts,
      hideHome: data.settings.hideHome,
      hideComments: data.settings.hideComments,
      hideRecommendations: data.settings.hideRecommendations,
      hideSidebar: data.settings.hideSidebar
    });

  } catch (err) {

    console.log("Settings sync failed", err);

  }

}

setInterval(syncSettings, 5000);


/* ========= RUN TIMER EVERY SECOND ========= */

setInterval(runTimer, 1000);

/* ========= MESSAGE LISTENER ========= */

chrome.runtime.onMessage.addListener((msg) => {

  if (msg.action === "startFocus") {
    startFocus();
  }

  if (msg.action === "stopTimer") {
    stopTimer();
  }

});