const taskInput = document.getElementById('task-input');
const taskTime = document.getElementById('task-time');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Load saved tasks
window.onload = () => {
  tasks.forEach(task => renderTask(task.text, task.done, task.time));
  requestNotificationPermission();
  checkReminders();
};

addBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  const time = taskTime.value;

  if (!text) return alert("Please enter a task!");
  if (!time) return alert("Please select date and time!");

  const task = { text, done: false, time, reminded: false };
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  renderTask(task.text, task.done, task.time);
  taskInput.value = "";
  taskTime.value = "";
});

function renderTask(text, done, time) {
  const li = document.createElement('li');
  if (done) li.classList.add('done');

  const header = document.createElement('div');
  header.classList.add('task-header');

  const span = document.createElement('span');
  span.textContent = text;
  span.classList.add('task-text');
  span.addEventListener('click', () => {
    li.classList.toggle('done');
    updateStorage();
  });

  const del = document.createElement('button');
  del.textContent = "✖";
  del.classList.add('delete-btn');
  del.addEventListener('click', (e) => {
    e.stopPropagation();
    li.remove();
    updateStorage();
  });

  header.appendChild(span);
  header.appendChild(del);

  const timeEl = document.createElement('div');
  timeEl.classList.add('task-time');
  timeEl.textContent = "🕒 " + new Date(time).toLocaleString();

  li.appendChild(header);
  li.appendChild(timeEl);

  taskList.appendChild(li);
}

function updateStorage() {
  const updated = [];
  document.querySelectorAll('#task-list li').forEach(li => {
    const text = li.querySelector('.task-text').textContent;
    const time = li.querySelector('.task-time').textContent.replace("🕒 ", "");
    const done = li.classList.contains('done');
    updated.push({ text, time, done });
  });
  localStorage.setItem('tasks', JSON.stringify(updated));
}

// Request notification permission
function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}

// Reminder check
function checkReminders() {
  setInterval(() => {
    const now = new Date().getTime();
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach((task, index) => {
      const taskTime = new Date(task.time).getTime();
      if (!task.reminded && taskTime - now <= 0 && !task.done) {
        showNotification(task.text);
        tasks[index].reminded = true;
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
    });
  }, 30000); // every 30 sec
}

// Show reminder notification
function showNotification(task) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("⏰ Task Reminder", {
      body: task,
      icon: "https://cdn-icons-png.flaticon.com/512/3209/3209265.png"
    });
  } else {
    alert(`⏰ Reminder: ${task}`);
  }
}
