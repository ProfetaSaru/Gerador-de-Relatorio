document.addEventListener('DOMContentLoaded', () => {
  const storageKey = 'relatorio-atividades';
  let tasks = loadTasks();
  let editingTaskId = null;

  const form = document.querySelector('#task-form');
  const formTitle = document.querySelector('#form-title');
  const submitButton = document.querySelector('#submit-task');
  const cancelEditButton = document.querySelector('#cancel-edit');
  const formMessage = document.querySelector('#form-message');
  const taskList = document.querySelector('#task-list');
  const emptyState = document.querySelector('#empty-state');
  const reportPreview = document.querySelector('#report-preview');
  const taskCount = document.querySelector('#task-count');
  const copyButton = document.querySelector('#copy-report');
  const clearButton = document.querySelector('#clear-tasks');
  const modal = document.querySelector('#confirm-modal');

  function loadTasks() {
    try {
      const savedTasks = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return Array.isArray(savedTasks) ? savedTasks : [];
    } catch {
      return [];
    }
  }

  function saveTasks() {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }

  function sortTasks() {
    tasks.sort((firstTask, secondTask) => firstTask.start.localeCompare(secondTask.start));
  }

  function formatTask(task) {
    const title = task.description ? `*${task.title}:*` : `*${task.title}*`;
    const description = task.description ? ` - ${task.description}` : '';
    return `${task.start} – ${task.end} ${title}${description};`;
  }

  function render() {
    sortTasks();
    taskList.replaceChildren();
    emptyState.classList.toggle('hidden', tasks.length > 0);
    taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? 'tarefa' : 'tarefas'}`;
    reportPreview.textContent = tasks.length
      ? ['RELATÓRIO DE CONCLUSÃO DE ATIVIDADES', ...tasks.map(formatTask)].join('\n')
      : 'Nenhuma tarefa para mostrar.';

    tasks.forEach((task) => {
      const item = document.createElement('article');
      item.className = 'task-item';

      const content = document.createElement('div');
      content.className = 'task-content';
      const time = document.createElement('span');
      time.className = 'task-time';
      time.textContent = `${task.start} – ${task.end}`;
      const title = document.createElement('h3');
      title.textContent = task.title;
      content.append(time, title);
      if (task.description) {
        const description = document.createElement('p');
        description.textContent = task.description;
        content.appendChild(description);
      }

      const actions = document.createElement('div');
      actions.className = 'task-actions';
      const editButton = createActionButton('Editar', 'edit-button');
      const deleteButton = createActionButton('Excluir', 'delete-button');
      editButton.addEventListener('click', () => startEditing(task));
      deleteButton.addEventListener('click', () => deleteTask(task.id));
      actions.append(editButton, deleteButton);
      item.append(content, actions);
      taskList.appendChild(item);
    });
  }

  function createActionButton(label, className) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = label;
    return button;
  }

  function startEditing(task) {
    editingTaskId = task.id;
    document.querySelector('#start-time').value = task.start;
    document.querySelector('#end-time').value = task.end;
    document.querySelector('#title').value = task.title;
    document.querySelector('#description').value = task.description;
    formTitle.textContent = 'Editar tarefa';
    submitButton.textContent = 'Salvar alterações';
    cancelEditButton.classList.remove('hidden');
    document.querySelector('#start-time').focus();
  }

  function resetForm() {
    editingTaskId = null;
    form.reset();
    formTitle.textContent = 'Adicionar tarefa';
    submitButton.textContent = 'Adicionar tarefa';
    cancelEditButton.classList.add('hidden');
  }

  function deleteTask(taskId) {
    const task = tasks.find((item) => item.id === taskId);
    if (!task || !window.confirm(`Excluir a tarefa "${task.title}"?`)) return;
    tasks = tasks.filter((item) => item.id !== taskId);
    saveTasks();
    if (editingTaskId === taskId) resetForm();
    render();
  }

  function showMessage(message, type = '') {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    window.setTimeout(() => {
      formMessage.textContent = '';
      formMessage.className = 'form-message';
    }, 2400);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const taskData = {
      start: formData.get('start-time'),
      end: formData.get('end-time'),
      title: formData.get('title').toString().trim(),
      description: formData.get('description').toString().trim(),
    };

    if (taskData.end < taskData.start) {
      showMessage('A hora final não pode ser anterior à hora inicial.', 'error');
      return;
    }

    if (editingTaskId) {
      const task = tasks.find((item) => item.id === editingTaskId);
      Object.assign(task, taskData);
      showMessage('Tarefa atualizada.', 'success');
    } else {
      tasks.push({ id: crypto.randomUUID(), ...taskData });
      showMessage('Tarefa adicionada.', 'success');
    }

    saveTasks();
    resetForm();
    render();
  });

  cancelEditButton.addEventListener('click', resetForm);

  copyButton.addEventListener('click', async () => {
    if (!tasks.length) {
      showMessage('Adicione uma tarefa antes de copiar.', 'error');
      return;
    }
    try {
      await navigator.clipboard.writeText(reportPreview.textContent);
      showMessage('Relatório copiado.', 'success');
    } catch {
      showMessage('Não foi possível copiar o relatório.', 'error');
    }
  });

  clearButton.addEventListener('click', () => {
    if (!tasks.length) return;
    modal.classList.remove('hidden');
  });

  document.querySelector('#cancel-delete').addEventListener('click', () => modal.classList.add('hidden'));
  document.querySelector('#confirm-delete').addEventListener('click', () => {
    tasks = [];
    saveTasks();
    resetForm();
    render();
    modal.classList.add('hidden');
    showMessage('Todas as tarefas foram excluídas.', 'success');
  });
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.classList.add('hidden');
  });

  render();
});
