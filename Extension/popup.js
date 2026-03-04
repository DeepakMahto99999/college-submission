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

/* ================= START TIMER ================= */

startBtn.onclick = () => {
  chrome.runtime.sendMessage({ action: "startFocus" });
};

/* ================= STOP TIMER ================= */

stopBtn.onclick = () => {
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
      } else if (mode === "break") {
        timerDisplay.style.color = "green";
      } else {
        timerDisplay.style.color = "white";
      }

      /* 🔒 LOCK TOPIC DURING FOCUS */
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