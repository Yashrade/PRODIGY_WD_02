let startTime, updatedTime, difference, tInterval;
let running = false;
let laps = JSON.parse(localStorage.getItem('laps')) || [];
let theme = localStorage.getItem('theme') || 'light';

const display = document.getElementById('display');
const startStopButton = document.getElementById('startStop');
const resetButton = document.getElementById('reset');
const lapButton = document.getElementById('lap');
const themeToggleButton = document.getElementById('themeToggle');
const lapsList = document.getElementById('lapsList');

document.body.classList.toggle(theme);

startStopButton.addEventListener('click', startStop);
resetButton.addEventListener('click', reset);
lapButton.addEventListener('click', recordLap);
themeToggleButton.addEventListener('click', toggleTheme);

if (localStorage.getItem('running') === 'true') {
    startTime = new Date().getTime() - (parseInt(localStorage.getItem('difference'), 10) || 0);
    startStop();
}

function startStop() {
    if (!running) {
        startTime = new Date().getTime() - (difference || 0);
        tInterval = setInterval(updateTime, 10);
        startStopButton.textContent = 'Pause';
        running = true;
        localStorage.setItem('running', 'true');
    } else {
        clearInterval(tInterval);
        difference = new Date().getTime() - startTime;
        startStopButton.textContent = 'Start';
        running = false;
        localStorage.setItem('running', 'false');
        localStorage.setItem('difference', difference);
    }
}

function reset() {
    clearInterval(tInterval);
    startTime = 0;
    difference = 0;
    running = false;
    display.textContent = '00:00:00.00';
    startStopButton.textContent = 'Start';
    laps = [];
    renderLaps();
    localStorage.clear();
}

function recordLap() {
    if (running) {
        const now = new Date().toLocaleTimeString();
        const lapTime = display.textContent;
        laps.push(`${now} - ${lapTime}`);
        renderLaps();
        localStorage.setItem('laps', JSON.stringify(laps));
    }
}

function updateTime() {
    updatedTime = new Date().getTime();
    difference = updatedTime - startTime;

    let hours = Math.floor(difference / (1000 * 60 * 60));
    let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((difference % (1000 * 60)) / 1000);
    let milliseconds = Math.floor((difference % 1000) / 10);

    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    milliseconds = (milliseconds < 10) ? '0' + milliseconds : milliseconds;

    display.textContent = `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function renderLaps() {
    lapsList.innerHTML = laps.map(lap => `<li>${lap}</li>`).join('');
}

function toggleTheme() {
    const themes = ['light', 'dark-theme', 'theme-blue', 'theme-green'];
    let currentTheme = document.body.className;
    let newThemeIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
    document.body.className = themes[newThemeIndex];
    localStorage.setItem('theme', themes[newThemeIndex]);
}

renderLaps();
