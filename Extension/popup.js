/* ============================
   FOCUSTUBE POPUP SCRIPT
============================ */

const topicInput = document.getElementById("topic");
const saveBtn = document.getElementById("save");
const startBtn = document.getElementById("startPomodoro");
const stopBtn = document.getElementById("stopPomodoro");
const timerDisplay = document.getElementById("timerDisplay");
const status = document.getElementById("status");


/* ================= LOAD SAVED TOPIC ================= */
chrome.storage.sync.get(["focusTopic"], (res) => {
  if (res.focusTopic) {
    topicInput.value = res.focusTopic;
  }
});


/* ================= SAVE FOCUS TOPIC ================= */

saveBtn.onclick = () => {

  const topic = topicInput.value.trim().toLowerCase();

  if (!topic) {
    status.innerText = "Please enter a topic.";
    return;
  }

  chrome.storage.sync.set({ focusTopic: topic }, () => {
    status.innerText = "Focus set to: " + topic;
  });

};


/* ================= START SESSION ================= */

async function startSession() {

  const topic = topicInput.value.trim().toLowerCase();

  if (!topic) {
    status.innerText = "Please enter a topic.";
    return;
  }

  // activate extension immediately
  await chrome.storage.sync.set({
    focusTopic: topic,
    pomodoroMode: "focus"
  });

  try {
    const res = await fetch("http://localhost:5000/api/sessions/start", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicName: topic })
    });

    const data = await res.json();

    if (data.success) {
      await chrome.storage.sync.set({
        sessionId: data.sessionId
      });

      chrome.runtime.sendMessage({ action: "startFocus" });

      status.innerText = "Session started";
    } else {
      status.innerText = data.message;
    }

  } catch (err) {
    status.innerText = "Server error";
  }
}


/* ================= START BUTTON ================= */

startBtn.onclick = startSession;


/* ================= STOP TIMER ================= */

stopBtn.onclick = async () => {

  const { sessionId } = await chrome.storage.sync.get("sessionId");

  if (sessionId) {

    try {

      await fetch(
        `http://localhost:5000/api/sessions/cancel/${sessionId}`,
        {
          method: "POST",
          credentials: "include"
        }
      );

    } catch (err) {
      console.error("Reset session failed", err);
    }

  }

  await chrome.storage.sync.set({
    focusTopic: "",   // clear topic
    pomodoroMode: "idle"
  });

  chrome.runtime.sendMessage({ action: "stopTimer" });

};


/* ================= LIVE TIMER UPDATE ================= */

setInterval(() => {

  chrome.storage.sync.get(
    ["pomodoroTimeLeft", "pomodoroMode"],
    (res) => {

      const time = res.pomodoroTimeLeft || 0;
      const mode = res.pomodoroMode || "idle";

      let minutes = Math.floor(time / 60);
      let seconds = time % 60;

      timerDisplay.innerText =
        minutes.toString().padStart(2, "0") +
        ":" +
        seconds.toString().padStart(2, "0");

      /* COLOR CHANGE BASED ON MODE */

      if (mode === "focus") {
        timerDisplay.style.color = "red";
      }
      else if (mode === "break") {
        timerDisplay.style.color = "green";
      }
      else {
        timerDisplay.style.color = "white";
      }

      /* LOCK TOPIC DURING SESSION */

      if (mode === "focus") {
        topicInput.disabled = true;
        saveBtn.disabled = true;
      } else {
        topicInput.disabled = false;
        saveBtn.disabled = false;
      }

    }
  );

}, 1000);