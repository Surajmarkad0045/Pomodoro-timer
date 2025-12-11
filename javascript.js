// Selecting Elements
const timeDisplay = document.getElementById("time-display");
const sessionLabel = document.getElementById("session-label");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const saveSettingsBtn = document.getElementById("save-settings");

// Custom Inputs
const workInput = document.getElementById("work-duration");
const shortBreakInput = document.getElementById("short-break");
const longBreakInput = document.getElementById("long-break");

// Timer Variables
let timer;
let isRunning = false;
let secondsLeft;
let cycleCount = 0;

// Default Values
let workDuration = 25;
let shortBreak = 5;
let longBreak = 15;

// Initialize Display
function setInitialTime() {
    secondsLeft = workDuration * 60;
    updateDisplay();
}
setInitialTime();

// Update Timer Display
function updateDisplay() {
    let minutes = Math.floor(secondsLeft / 60);
    let seconds = secondsLeft % 60;
    timeDisplay.textContent =
        `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

// Start Timer
startBtn.addEventListener("click", () => {
    if (!isRunning) {
        isRunning = true;

        timer = setInterval(() => {
            secondsLeft--;
            updateDisplay();

            // When timer finishes
            if (secondsLeft <= 0) {
                clearInterval(timer);
                isRunning = false;
                switchSession();
            }
        }, 1000);
    }
});

// Pause Timer
pauseBtn.addEventListener("click", () => {
    clearInterval(timer);
    isRunning = false;
});

// Reset Timer
resetBtn.addEventListener("click", () => {
    clearInterval(timer);
    isRunning = false;
    sessionLabel.textContent = "Work Session";
    secondsLeft = workDuration * 60;
    updateDisplay();
});

// Switch Sessions Automatically
function switchSession() {
    cycleCount++;

    if (cycleCount % 4 === 0) {
        // Long Break After 4 Work Sessions
        sessionLabel.textContent = "Long Break";
        secondsLeft = longBreak * 60;
    } else {
        // Alternate Work ↔ Short Break
        if (sessionLabel.textContent === "Work Session") {
            sessionLabel.textContent = "Short Break";
            secondsLeft = shortBreak * 60;
        } else {
            sessionLabel.textContent = "Work Session";
            secondsLeft = workDuration * 60;
        }
    }

    updateDisplay();
}

// Save Custom Settings
saveSettingsBtn.addEventListener("click", () => {
    workDuration = parseInt(workInput.value);
    shortBreak = parseInt(shortBreakInput.value);
    longBreak = parseInt(longBreakInput.value);

    clearInterval(timer);
    isRunning = false;
    sessionLabel.textContent = "Work Session";

    secondsLeft = workDuration * 60;
    updateDisplay();

    alert("Settings Updated Successfully!");
});
