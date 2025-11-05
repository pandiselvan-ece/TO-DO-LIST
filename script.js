const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Load existing tasks
window.onload = () => {
  tasks.forEach(task => renderTask(task.text, task.done));
};

addBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  if (!text) return alert("Enter a task!");
  tasks.push({ text, done: false });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTask(text, false);
  taskInput.value = "";
});

function renderTask(text, done) {
  const li = document.createElement('li');
  li.textContent = text;
  if (done) li.classList.add('done');

  li.addEventListener('click', () => {
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

  li.appendChild(del);
  taskList.appendChild(li);
}

function updateStorage() {
  const updated = [];
  document.querySelectorAll('#task-list li').forEach(li => {
    updated.push({
      text: li.firstChild.textContent,
      done: li.classList.contains('done')
    });
  });
  localStorage.setItem('tasks', JSON.stringify(updated));
}
