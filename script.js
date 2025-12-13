/*
 Pomodoro Timer with Customization Options
 Rewritten & simplified version of script.js
 Purpose: Implement timer functionality with clean structure and comments
*/

(() => {
  /* =====================
     DOM ELEMENTS
  ===================== */
  const timeText = document.getElementById('timeText');
  const modeLabel = document.getElementById('modeLabel');
  const cycleLabel = document.getElementById('cycleLabel');

  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');

  const workInput = document.getElementById('workInput');
  const shortInput = document.getElementById('shortInput');
  const longInput = document.getElementById('longInput');
  const cyclesUntilLong = document.getElementById('cyclesUntilLong');

  const autoStart = document.getElementById('autoStart');
  const soundSelect = document.getElementById('soundSelect');
  const themeSelect = document.getElementById('themeSelect');
  const notifySelect = document.getElementById('notifySelect');

  const saveBtn = document.getElementById('saveBtn');
  const restoreBtn = document.getElementById('restoreBtn');

  const ringProgress = document.querySelector('.ring-progress');

  /* =====================
     DEFAULT SETTINGS
  ===================== */
  const DEFAULTS = {
    work: 25,
    short: 5,
    long: 15,
    cyclesUntilLong: 4,
    autoStart: false,
    sound: 'beep',
    theme: 'dark',
    notify: false
  };

  /* =====================
     STATE VARIABLES
  ===================== */
  let timer = null;
  let remaining = 0;      // seconds left
  let total = 0;          // total seconds of session
  let running = false;
  let mode = 'work';      // work | short | long
  let cycleCount = 0;     // completed work sessions

  /* =====================
     UTILITY FUNCTIONS
  ===================== */

  // Convert seconds into MM:SS format
  function formatTime(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  /* =====================
     PROGRESS RING LOGIC
  ===================== */
  const RADIUS = 54;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  ringProgress.style.strokeDasharray = `${CIRCUMFERENCE}`;

  function updateProgress() {
    const percent = total ? (total - remaining) / total : 0;
    ringProgress.style.strokeDashoffset = CIRCUMFERENCE * (1 - percent);
  }

  /* =====================
     SETTINGS (LOCAL STORAGE)
  ===================== */
  function loadSettings() {
    const saved = JSON.parse(localStorage.getItem('pomodoro.settings')) || {};
    const s = { ...DEFAULTS, ...saved };

    workInput.value = s.work;
    shortInput.value = s.short;
    longInput.value = s.long;
    cyclesUntilLong.value = s.cyclesUntilLong;
    autoStart.value = String(s.autoStart);
    soundSelect.value = s.sound;
    themeSelect.value = s.theme;
    notifySelect.value = String(s.notify);

    applyTheme(s.theme);
  }

  function saveSettings() {
    const settings = {
      work: +workInput.value,
      short: +shortInput.value,
      long: +longInput.value,
      cyclesUntilLong: +cyclesUntilLong.value,
      autoStart: autoStart.value === 'true',
      sound: soundSelect.value,
      theme: themeSelect.value,
      notify: notifySelect.value === 'true'
    };

    localStorage.setItem('pomodoro.settings', JSON.stringify(settings));
    applyTheme(settings.theme);
    alert('Settings saved successfully');
  }

  function restoreDefaults() {
    localStorage.removeItem('pomodoro.settings');
    loadSettings();
    resetTimer();
  }

  /* =====================
     THEME HANDLING
  ===================== */
  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
  }

  /* =====================
     SOUND NOTIFICATION (CUSTOM SOUNDS)
  ===================== */

  // Audio object for custom sounds
  let audio = new Audio();

  function playSound(type) {
    if (type === 'none') return;

    // Predefined sound files (place in sounds/ folder)
    const sounds = {
      beep: 'sounds/beep.mp3',
      bell: 'sounds/bell.mp3',
      alarm: 'sounds/alarm.mp3'
    };

    if (sounds[type]) {
      audio.src = sounds[type];
      audio.currentTime = 0;
      audio.play();
    }
  }

  /* =====================
     TIMER CORE LOGIC
  ===================== */
  function setMode(newMode) {
    mode = newMode;
    modeLabel.textContent = newMode === 'work'
      ? 'Work'
      : newMode === 'short'
      ? 'Short Break'
      : 'Long Break';

    const minutes = newMode === 'work'
      ? workInput.value
      : newMode === 'short'
      ? shortInput.value
      : longInput.value;

    total = remaining = minutes * 60;
    updateUI();
  }

  function startTimer() {
    if (running) return;
    running = true;
    timer = setInterval(() => {
      remaining--;
      updateUI();

      if (remaining <= 0) completeSession();
    }, 1000);
  }

  function pauseTimer() {
    running = false;
    clearInterval(timer);
  }

  function resetTimer() {
    pauseTimer();
    cycleCount = 0;
    setMode('work');
  }

  function completeSession() {
    pauseTimer();
    playSound(soundSelect.value);

    if (mode === 'work') cycleCount++;

    const needLongBreak = cycleCount % cyclesUntilLong.value === 0;
    const nextMode = mode === 'work'
      ? (needLongBreak ? 'long' : 'short')
      : 'work';

    setMode(nextMode);

    if (autoStart.value === 'true') startTimer();
  }

  function updateUI() {
    timeText.textContent = formatTime(remaining);
    cycleLabel.textContent = `Cycle ${cycleCount}`;
    updateProgress();
  }

  /* =====================
     EVENT LISTENERS
  ===================== */
  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);

  saveBtn.addEventListener('click', saveSettings);
  restoreBtn.addEventListener('click', restoreDefaults);

  /* =====================
     INITIALIZATION
  ===================== */
  loadSettings();
  setMode('work');
})();
