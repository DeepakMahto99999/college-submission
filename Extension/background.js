let timer = null;
let mode = "idle";
let timeLeft = 0;

function updateStorage() {
  chrome.storage.sync.set({
    pomodoroMode: mode,
    pomodoroTimeLeft: timeLeft
  });
}

function startFocus() {
  mode = "focus";
  timeLeft = 25 * 60;
  runTimer();
}

function startBreak() {
  mode = "break";
  timeLeft = 5 * 60;
  runTimer();
}

function runTimer() {
  if (timer) clearInterval(timer);

  updateStorage();

  timer = setInterval(() => {
    timeLeft--;
    updateStorage();

    if (timeLeft <= 0) {
      clearInterval(timer);
      if (mode === "focus") {
        startBreak();
      } else {
        startFocus();
      }
    }
  }, 1000);
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "startFocus") {
    startFocus();
  }

  if (msg.action === "stopTimer") {
    if (timer) clearInterval(timer);
    mode = "idle";
    timeLeft = 0;
    updateStorage();
  }
});