// Reminder functionality for task and time pop-up

document.addEventListener('DOMContentLoaded', function () {
  // Request notification permission on page load
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }

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

// Daily quote functionality

<script>
async function fetchQuote() {
  try {
    const res = await fetch('http://localhost:3000/api/quote');
    const data = await res.json();
    document.getElementById('daily-quote').textContent = data.quote;
  } catch (e) {
    document.getElementById('daily-quote').textContent = "Could not load quote.";
  }
}

// Fetch quote on page load
fetchQuote();
</script>

// Zen mode functionality

const zenBtn = document.getElementById('zen-btn');
const zenMsg = document.getElementById('zen-msg');
const zenAudio = document.getElementById('zen-audio');
let zenOn = false;

zenBtn.addEventListener('click', () => {
  zenOn = !zenOn;
  if (zenOn) {
    zenAudio.currentTime = 0;
    zenAudio.volume = 0.3;
    zenAudio.play().then(() => {
      zenMsg.style.display = 'block';
      zenBtn.textContent = 'Turn Off Zen Mode';
    }).catch((e) => {
      alert('Audio playback was blocked by your browser. Please interact with the page and try again.');
      zenOn = false;
    });
  } else {
    zenAudio.pause();
    zenAudio.currentTime = 0;
    zenMsg.style.display = 'none';
    zenBtn.textContent = 'Turn On Zen Mode';
  }
});