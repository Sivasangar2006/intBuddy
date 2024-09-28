const socket = io();
let countdownInterval;
let remainingTime = 0; // Time in seconds

// Function to format time
function formatTime(seconds) {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${secs}`;
}

// Update the timer display
function updateTimerDisplay() {
    document.getElementById('timer').textContent = formatTime(remainingTime);
}

// Update the progress bar
function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const initialTime = parseInt(document.getElementById('timeInput').value) * 60; // Convert to seconds
    const percentage = ((initialTime - remainingTime) / initialTime) * 100;
    progressBar.style.width = `${percentage}%`;
}

// Start the countdown
document.getElementById('startButton').addEventListener('click', () => {
    const inputTime = parseInt(document.getElementById('timeInput').value);
    if (!isNaN(inputTime) && inputTime > 0) {
        remainingTime = inputTime * 60; // Convert input from minutes to seconds
        updateTimerDisplay();
        updateProgressBar();

        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        countdownInterval = setInterval(() => {
            if (remainingTime > 0) {
                remainingTime--;
                updateTimerDisplay();
                updateProgressBar();
                socket.emit('timerUpdate', remainingTime);
            } else {
                clearInterval(countdownInterval);
                socket.emit('timerExpired');
            }
        }, 1000);
    }
});

// Stop the countdown
document.getElementById('stopButton').addEventListener('click', () => {
    clearInterval(countdownInterval);
});

// Reset the countdown
document.getElementById('resetButton').addEventListener('click', () => {
    clearInterval(countdownInterval);
    remainingTime = 0;
    updateTimerDisplay();
    updateProgressBar();
    socket.emit('timerReset');
});

// Listen for timer updates from the server
socket.on('timerUpdate', (time) => {
    remainingTime = time;
    updateTimerDisplay();
    updateProgressBar();
});

// Listen for timer expiration from the server
socket.on('timerExpired', () => {
    clearInterval(countdownInterval);
    alert('Time is up!');
});

// Listen for timer reset from the server
socket.on('timerReset', () => {
    remainingTime = 0;
    updateTimerDisplay();
    updateProgressBar();
});
