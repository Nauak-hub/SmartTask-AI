'use strict';

const API = {
  tasks: '/api/tasks',
  ai: '/api/ai/suggest-task'
};

const state = {
  tasks: [],
  editingId: null,
  deletingId: null,
  layout: localStorage.getItem('smarttask-layout') || 'grid'
};

const elements = {
  tasksContainer: document.querySelector('#tasksContainer'),
  loadingState: document.querySelector('#loadingState'),
  emptyState: document.querySelector('#emptyState'),
  searchInput: document.querySelector('#searchInput'),
  statusFilter: document.querySelector('#statusFilter'),
  priorityFilter: document.querySelector('#priorityFilter'),
  taskModal: document.querySelector('#taskModal'),
  taskForm: document.querySelector('#taskForm'),
  modalTitle: document.querySelector('#modalTitle'),
  saveTaskButton: document.querySelector('#saveTaskButton'),
  confirmDialog: document.querySelector('#confirmDialog'),
  quickAiText: document.querySelector('#quickAiText'),
  quickAiButton: document.querySelector('#quickAiButton'),
  sidebar: document.querySelector('#sidebar')
};

const priorityLabels = { LOW: 'Baixa', MEDIUM: 'Média', HIGH: 'Alta', URGENT: 'Urgente' };
const statusLabels = { PENDING: 'Pendente', IN_PROGRESS: 'Em andamento', COMPLETED: 'Concluída', CANCELLED: 'Cancelada' };

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });

  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = body?.message || body?.detail || 'Não foi possível concluir a operação.';
    throw new Error(message);
  }
  return body;
}

async function loadTasks() {
  setLoading(true);
  try {
    state.tasks = await apiRequest(API.tasks);
    renderAll();
  } catch (error) {
    showToast(error.message, 'error');
    state.tasks = [];
    renderAll();
  } finally {
    setLoading(false);
  }
}

function renderAll() {
  updateStats();
  renderTasks();
}

function updateStats() {
  document.querySelector('#totalCount').textContent = state.tasks.length;
  document.querySelector('#pendingCount').textContent = countByStatus('PENDING');
  document.querySelector('#progressCount').textContent = countByStatus('IN_PROGRESS');
  document.querySelector('#completedCount').textContent = countByStatus('COMPLETED');
}

function countByStatus(status) {
  return state.tasks.filter(task => task.status === status).length;
}

function filteredTasks() {
  const query = elements.searchInput.value.trim().toLowerCase();
  const status = elements.statusFilter.value;
  const priority = elements.priorityFilter.value;

  return state.tasks
    .filter(task => status === 'ALL' || task.status === status)
    .filter(task => priority === 'ALL' || task.priority === priority)
    .filter(task => {
      if (!query) return true;
      return [task.title, task.description, task.category]
        .filter(Boolean)
        .some(value => value.toLowerCase().includes(query));
    })
    .sort((a, b) => {
      if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return 1;
      if (a.status !== 'COMPLETED' && b.status === 'COMPLETED') return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
}

function renderTasks() {
  const tasks = filteredTasks();
  elements.tasksContainer.classList.toggle('list-layout', state.layout === 'list');
  document.querySelectorAll('[data-layout]').forEach(button => {
    button.classList.toggle('active', button.dataset.layout === state.layout);
  });

  if (tasks.length === 0) {
    elements.tasksContainer.classList.add('hidden');
    elements.emptyState.classList.remove('hidden');
    elements.tasksContainer.innerHTML = '';
    return;
  }

  elements.emptyState.classList.add('hidden');
  elements.tasksContainer.classList.remove('hidden');
  elements.tasksContainer.innerHTML = tasks.map(taskCardTemplate).join('');
}

function taskCardTemplate(task) {
  const due = task.dueDate ? formatDate(task.dueDate) : 'Sem prazo';
  const category = escapeHtml(task.category || 'Geral');
  const description = escapeHtml(task.description || 'Sem descrição adicional.');
  const subtasksCount = Array.isArray(task.subtasks) ? task.subtasks.length : 0;

  return `
    <article class="task-card ${task.status === 'COMPLETED' ? 'completed' : ''}" data-task-id="${task.id}">
      <div class="task-card-top">
        <div class="task-badges">
          <span class="badge priority-${task.priority}">${priorityLabels[task.priority] || task.priority}</span>
          <span class="badge status-${task.status}">${statusLabels[task.status] || task.status}</span>
        </div>
        <div class="card-menu">
          <button class="menu-button" data-action="menu" aria-label="Mais opções">⋯</button>
          <div class="dropdown-menu hidden">
            <button data-action="edit">Editar tarefa</button>
            <button data-action="duplicate">Duplicar tarefa</button>
            <button class="delete-action" data-action="delete">Excluir tarefa</button>
          </div>
        </div>
      </div>
      <h3 class="task-title">${escapeHtml(task.title)}</h3>
      <p class="task-description">${description}</p>
      <div class="task-meta">
        <span>◫ ${due}</span>
        <span>⌑ ${category}</span>
      </div>
      <div class="task-footer">
        <select class="status-select" data-action="status" aria-label="Alterar status">
          ${Object.entries(statusLabels).map(([value, label]) => `<option value="${value}" ${task.status === value ? 'selected' : ''}>${label}</option>`).join('')}
        </select>
        <span class="subtasks-count">${subtasksCount} ${subtasksCount === 1 ? 'subtarefa' : 'subtarefas'}</span>
      </div>
    </article>`;
}

function openTaskModal(task = null) {
  state.editingId = task?.id || null;
  elements.modalTitle.textContent = task ? 'Editar tarefa' : 'Nova tarefa';
  elements.saveTaskButton.textContent = task ? 'Salvar alterações' : 'Salvar tarefa';

  document.querySelector('#taskId').value = task?.id || '';
  document.querySelector('#title').value = task?.title || '';
  document.querySelector('#description').value = task?.description || '';
  document.querySelector('#priority').value = task?.priority || 'MEDIUM';
  document.querySelector('#dueDate').value = task?.dueDate || '';
  document.querySelector('#category').value = task?.category || '';
  document.querySelector('#subtasks').value = (task?.subtasks || []).join('\n');
  clearValidation();

  elements.taskModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.querySelector('#title').focus(), 50);
}

function closeTaskModal() {
  elements.taskModal.classList.add('hidden');
  document.body.style.overflow = '';
  state.editingId = null;
  elements.taskForm.reset();
  clearValidation();
}

function taskPayloadFromForm() {
  return {
    title: document.querySelector('#title').value.trim(),
    description: nullIfBlank(document.querySelector('#description').value),
    priority: document.querySelector('#priority').value,
    dueDate: nullIfBlank(document.querySelector('#dueDate').value),
    category: nullIfBlank(document.querySelector('#category').value),
    subtasks: document.querySelector('#subtasks').value
      .split('\n')
      .map(item => item.trim())
      .filter(Boolean)
  };
}

async function submitTask(event) {
  event.preventDefault();
  const payload = taskPayloadFromForm();

  if (!payload.title) {
    document.querySelector('[data-error-for="title"]').textContent = 'Informe um título para a tarefa.';
    document.querySelector('#title').focus();
    return;
  }

  const wasEditing = Boolean(state.editingId);
  setButtonLoading(elements.saveTaskButton, true, 'Salvando...');
  try {
    const method = state.editingId ? 'PUT' : 'POST';
    const url = state.editingId ? `${API.tasks}/${state.editingId}` : API.tasks;
    await apiRequest(url, { method, body: JSON.stringify(payload) });
    closeTaskModal();
    await loadTasks();
    showToast(wasEditing ? 'Tarefa atualizada com sucesso.' : 'Tarefa criada com sucesso.', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    setButtonLoading(elements.saveTaskButton, false);
  }
}

async function changeTaskStatus(id, status, selectElement) {
  selectElement.disabled = true;
  try {
    await apiRequest(`${API.tasks}/${id}/status?status=${encodeURIComponent(status)}`, { method: 'PATCH' });
    await loadTasks();
    showToast('Status atualizado.', 'success');
  } catch (error) {
    showToast(error.message, 'error');
    await loadTasks();
  } finally {
    selectElement.disabled = false;
  }
}

function requestDelete(id) {
  state.deletingId = id;
  elements.confirmDialog.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeDeleteDialog() {
  state.deletingId = null;
  elements.confirmDialog.classList.add('hidden');
  document.body.style.overflow = '';
}

async function confirmDelete() {
  if (!state.deletingId) return;
  const button = document.querySelector('#confirmDelete');
  setButtonLoading(button, true, 'Excluindo...');
  try {
    await apiRequest(`${API.tasks}/${state.deletingId}`, { method: 'DELETE' });
    closeDeleteDialog();
    await loadTasks();
    showToast('Tarefa excluída.', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    setButtonLoading(button, false);
  }
}

async function duplicateTask(task) {
  const payload = {
    title: `${task.title} (cópia)`,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate,
    category: task.category,
    subtasks: task.subtasks || []
  };
  try {
    await apiRequest(API.tasks, { method: 'POST', body: JSON.stringify(payload) });
    await loadTasks();
    showToast('Tarefa duplicada.', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function generateWithAi() {
  const text = elements.quickAiText.value.trim();
  if (!text) {
    showToast('Descreva primeiro a tarefa que deseja organizar.', 'info');
    elements.quickAiText.focus();
    return;
  }

  setButtonLoading(elements.quickAiButton, true, 'Analisando...');
  try {
    const suggestion = await apiRequest(API.ai, {
      method: 'POST',
      body: JSON.stringify({ text })
    });
    openTaskModal(suggestion);
    elements.quickAiText.value = '';
    showToast(`Sugestão gerada pelo provedor ${suggestion.provider || 'IA'}. Revise e salve.`, 'success');
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    setButtonLoading(elements.quickAiButton, false);
  }
}

function setLoading(loading) {
  elements.loadingState.classList.toggle('hidden', !loading);
  if (loading) {
    elements.tasksContainer.classList.add('hidden');
    elements.emptyState.classList.add('hidden');
  }
}

function setButtonLoading(button, loading, text = '') {
  if (loading) {
    button.dataset.originalText = button.textContent;
    button.textContent = text;
    button.disabled = true;
  } else {
    button.textContent = button.dataset.originalText || button.textContent;
    button.disabled = false;
  }
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<strong>${type === 'success' ? '✓' : type === 'error' ? '!' : 'i'}</strong><p>${escapeHtml(message)}</p>`;
  document.querySelector('#toastContainer').appendChild(toast);
  setTimeout(() => toast.remove(), 3800);
}

function clearValidation() {
  document.querySelectorAll('.field-error').forEach(element => element.textContent = '');
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR').format(new Date(year, month - 1, day));
}

function nullIfBlank(value) {
  const normalized = value.trim();
  return normalized ? normalized : null;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function findTask(id) {
  return state.tasks.find(task => task.id === Number(id));
}

function closeAllMenus(except = null) {
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    if (menu !== except) menu.classList.add('hidden');
  });
}

function bindEvents() {
  document.querySelector('#newTaskButton').addEventListener('click', () => openTaskModal());
  document.querySelector('#emptyNewTask').addEventListener('click', () => openTaskModal());
  document.querySelector('#closeModal').addEventListener('click', closeTaskModal);
  document.querySelector('#cancelModal').addEventListener('click', closeTaskModal);
  elements.taskForm.addEventListener('submit', submitTask);
  elements.quickAiButton.addEventListener('click', generateWithAi);
  document.querySelector('#sidebarAiButton').addEventListener('click', () => {
    elements.sidebar.classList.remove('open');
    elements.quickAiText.focus();
    elements.quickAiText.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  [elements.searchInput, elements.statusFilter, elements.priorityFilter].forEach(element => {
    element.addEventListener('input', renderTasks);
    element.addEventListener('change', renderTasks);
  });

  document.querySelector('#clearFilters').addEventListener('click', () => {
    elements.searchInput.value = '';
    elements.statusFilter.value = 'ALL';
    elements.priorityFilter.value = 'ALL';
    renderTasks();
  });

  document.querySelectorAll('[data-layout]').forEach(button => {
    button.addEventListener('click', () => {
      state.layout = button.dataset.layout;
      localStorage.setItem('smarttask-layout', state.layout);
      renderTasks();
    });
  });

  document.querySelectorAll('[data-status-filter]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      elements.statusFilter.value = button.dataset.statusFilter;
      renderTasks();
      elements.sidebar.classList.remove('open');
    });
  });

  document.querySelector('[data-view="dashboard"]').addEventListener('click', event => {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');
    elements.statusFilter.value = 'ALL';
    renderTasks();
    elements.sidebar.classList.remove('open');
  });

  elements.tasksContainer.addEventListener('click', event => {
    const card = event.target.closest('[data-task-id]');
    if (!card) return;
    const task = findTask(card.dataset.taskId);
    const action = event.target.dataset.action;

    if (action === 'menu') {
      const menu = event.target.nextElementSibling;
      const willOpen = menu.classList.contains('hidden');
      closeAllMenus();
      menu.classList.toggle('hidden', !willOpen);
    } else if (action === 'edit') {
      closeAllMenus();
      openTaskModal(task);
    } else if (action === 'duplicate') {
      closeAllMenus();
      duplicateTask(task);
    } else if (action === 'delete') {
      closeAllMenus();
      requestDelete(task.id);
    }
  });

  elements.tasksContainer.addEventListener('change', event => {
    if (event.target.dataset.action !== 'status') return;
    const card = event.target.closest('[data-task-id]');
    changeTaskStatus(card.dataset.taskId, event.target.value, event.target);
  });

  document.querySelector('#cancelDelete').addEventListener('click', closeDeleteDialog);
  document.querySelector('#confirmDelete').addEventListener('click', confirmDelete);
  document.querySelector('#menuToggle').addEventListener('click', () => elements.sidebar.classList.toggle('open'));

  document.querySelector('#themeToggle').addEventListener('click', event => {
    const dark = document.documentElement.dataset.theme === 'dark';
    document.documentElement.dataset.theme = dark ? 'light' : 'dark';
    localStorage.setItem('smarttask-theme', dark ? 'light' : 'dark');
    event.currentTarget.textContent = dark ? '☾' : '☀';
  });

  elements.taskModal.addEventListener('click', event => {
    if (event.target === elements.taskModal) closeTaskModal();
  });
  elements.confirmDialog.addEventListener('click', event => {
    if (event.target === elements.confirmDialog) closeDeleteDialog();
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.card-menu')) closeAllMenus();
    if (window.innerWidth <= 820 && !event.target.closest('#sidebar') && !event.target.closest('#menuToggle')) {
      elements.sidebar.classList.remove('open');
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (!elements.taskModal.classList.contains('hidden')) closeTaskModal();
      if (!elements.confirmDialog.classList.contains('hidden')) closeDeleteDialog();
      closeAllMenus();
    }
  });
}

function initializeTheme() {
  const savedTheme = localStorage.getItem('smarttask-theme') || 'light';
  document.documentElement.dataset.theme = savedTheme;
  document.querySelector('#themeToggle').textContent = savedTheme === 'dark' ? '☀' : '☾';
}

initializeTheme();
bindEvents();
loadTasks();
