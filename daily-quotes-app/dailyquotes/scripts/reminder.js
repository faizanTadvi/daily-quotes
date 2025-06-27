// Reminder functionality for task and time pop-up

document.addEventListener('DOMContentLoaded', function () {
  // Request notification permission on page load
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }

  // Reminder functionality
  const form = document.getElementById('reminderForm');
  const reminderList = document.getElementById('reminderList');
  let reminders = [];

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const task = document.getElementById('task').value.trim();
    const time = document.getElementById('time').value;
    if (!task || !time) return;

    // Calculate reminder time
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);

    // If time is in the past, set for tomorrow
    if (reminderTime < now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeout = reminderTime - now;

    // Schedule the reminder
    const reminder = { task, time, timeoutId: null };
    reminder.timeoutId = setTimeout(() => {
      showReminder(task, time);
    }, timeout);

    reminders.push(reminder);
    addReminderToList(task, time);

    form.reset();
  });

  function addReminderToList(task, time) {
    const li = document.createElement('li');
    li.textContent = `${task} at ${time}`;
    reminderList.appendChild(li);
  }

  function showReminder(task, time) {
    // Show browser notification if allowed, else use alert
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Study Reminder', {
        body: `${task} (${time})`,
      });
    } else {
      alert(`Reminder: ${task} (${time})`);
    }
  }

  // Daily quote functionality
  async function fetchQuote() {
    try {
      const res = await fetch(' https://daily-quotes-8d6m.onrender.com');
      const data = await res.json();
      document.getElementById('daily-quote').textContent = data.quote;
    } catch (e) {
      document.getElementById('daily-quote').textContent = "Could not load quote.";
    }
  }
  fetchQuote();

  // Zen mode functionality
  const zenBtn = document.getElementById('zen-btn');
  const zenMsg = document.getElementById('zen-msg');
  const zenAudio = document.getElementById('zen-audio');
  const zenInstructions = document.getElementById('zen-instructions');
  let zenOn = false;
  let zenTimeout = null;
  let instructionInterval = null;
  const instructions = [
    "Breathe in...",
    "Hold...",
    "Exhale slowly..."
  ];

  function setDarkZenBackground(on) {
    document.body.style.transition = "background 0.7s";
    if (on) {
      document.body.style.background = "linear-gradient(135deg, #232526 0%, #414345 100%)";
    } else {
      document.body.style.background = "linear-gradient(135deg, #f6d365 0%, #fda085 50%, #a1c4fd 100%)";
    }
  }

  function startZenInstructions() {
    let idx = 0;
    zenInstructions.style.display = "block";
    zenInstructions.textContent = instructions[idx];
    instructionInterval = setInterval(() => {
      idx = (idx + 1) % instructions.length;
      zenInstructions.textContent = instructions[idx];
    }, 4000);
  }

  function stopZenInstructions() {
    clearInterval(instructionInterval);
    zenInstructions.style.display = "none";
  }

  zenBtn.addEventListener('click', () => {
    if (!zenOn) {
      // Ask user for meditation time
      let minutes = prompt("How many minutes do you want to meditate?", "5");
      minutes = parseInt(minutes, 10);
      if (isNaN(minutes) || minutes < 1) {
        alert("Please enter a valid number of minutes.");
        return;
      }

      zenOn = true;
      setDarkZenBackground(true);
      zenMsg.style.display = 'block';
      zenMsg.textContent = "🧘 Let's Start";
      zenBtn.textContent = 'Zen Mode Running...';
      zenBtn.disabled = true;

      zenAudio.currentTime = 0;
      zenAudio.volume = 0.3;
      zenAudio.play().catch(() => {
        alert('Audio playback was blocked by your browser. Please interact with the page and try again.');
      });

      startZenInstructions();

      zenTimeout = setTimeout(() => {
        // End Zen Mode
        zenOn = false;
        setDarkZenBackground(false);
        zenMsg.style.display = 'block';
        zenMsg.textContent = "✨ Welcome back";
        zenBtn.textContent = 'Start Zen Mode';
        zenBtn.disabled = false;
        zenAudio.pause();
        zenAudio.currentTime = 0;
        stopZenInstructions();
        setTimeout(() => {
          zenMsg.style.display = 'none';
        }, 4000);
      }, minutes * 60 * 1000);

    }
  });

  function startZenMode(minutes) {
    const audio = document.getElementById('zen-audio');
    const overlay = document.getElementById('zenOverlay');
    const breatheText = document.getElementById('breatheText');

    audio.currentTime = 0;
    audio.volume = 0.3;
    audio.play();

    overlay.style.display = "flex";
    breatheText.style.display = "block";

    const instructions = [
      "🌬️ Take a deep breath in...",
      "😌 Hold it...",
      "🌿 Now exhale slowly...",
      "🌞 Relax your shoulders...",
      "🧘 Feel the calm around you..."
    ];
    let index = 0;

    // Loop through instructions every 4 seconds
    const instructionInterval = setInterval(() => {
      breatheText.textContent = instructions[index % instructions.length];
      index++;
    }, 4000);

    // Stop meditation after selected time
    setTimeout(() => {
      clearInterval(instructionInterval);
      audio.pause();
      audio.currentTime = 0;
      overlay.style.display = "none";
      alert("Welcome back 🌞 Hope you feel refreshed!");
    }, minutes * 60000);
  }
});
// This file contains the JavaScript code to handle the reminder functionality.
// It includes functions to add tasks, set timers, and trigger pop-up notifications at the specified times.

document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const timeInput = document.getElementById('time-input');

    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const task = taskInput.value;
        const time = timeInput.value;

        if (task && time) {
            const reminderTime = new Date(time).getTime();
            const currentTime = new Date().getTime();

            if (reminderTime > currentTime) {
                const timeout = reminderTime - currentTime;
                setTimeout(() => {
                    alert(`Reminder: ${task}`);
                }, timeout);
                alert(`Reminder set for "${task}" at ${new Date(reminderTime).toLocaleString()}`);
            } else {
                alert('Please select a future time for the reminder.');
            }
        } else {
            alert('Please enter both a task and a time.');
        }

        taskInput.value = '';
        timeInput.value = '';
    });
});