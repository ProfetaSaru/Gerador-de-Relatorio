document.addEventListener('DOMContentLoaded', () => {
  const session = requireRole('account');
  if (!session) return;

  const form = document.querySelector('#activity-form');
  const reportList = document.querySelector('#report-list');
  const copyButton = document.querySelector('#copy-report');
  const deleteButton = document.querySelector('#delete-report');
  const modal = document.querySelector('#confirm-modal');

  let account;

  function renderActivities() {
    reportList.innerHTML = '';
    if (!account.activities.length) {
      const empty = document.createElement('p');
      empty.className = 'empty-message';
      empty.textContent = 'Nenhuma atividade adicionada ainda.';
      reportList.appendChild(empty);
      return;
    }

    account.activities.forEach((activity) => {
      const item = document.createElement('p');
      item.className = 'report-item';
      const title = activity.description ? `*${activity.title}:*` : `*${activity.title}*`;
      item.textContent = `${activity.start} – ${activity.end} – ${title}${activity.description ? ` ${activity.description}` : ''};`;
      reportList.appendChild(item);
    });
  }

  function formatActivity(activity) {
    return activity.description
      ? `${activity.start} – ${activity.end} – *${activity.title}:* ${activity.description};`
      : `${activity.start} – ${activity.end} – *${activity.title}*;`;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const activity = {
      start: formData.get('start-time'),
      end: formData.get('end-time'),
      title: formData.get('title'),
      description: formData.get('description')?.toString().trim() || '',
    };
    try {
      const result = await apiRequest(`/api/accounts/${session.accountId}/activities`, {
        method: 'POST',
        body: JSON.stringify(activity),
      });
      account.activities = result.activities;
      form.reset();
      renderActivities();
    } catch (error) {
      alert(error.message);
    }
  });

  copyButton.addEventListener('click', async () => {
    if (!account.activities.length) {
      alert('Adicione uma atividade antes de copiar.');
      return;
    }
    const text = ['*RELATÓRIO DE CONCLUSÃO DE ATIVIDADE*', ...account.activities.map(formatActivity)].join('\n');
    await navigator.clipboard.writeText(text);
    copyButton.textContent = 'Copiado!';
    setTimeout(() => { copyButton.textContent = 'Copiar'; }, 1500);
  });

  deleteButton.addEventListener('click', () => {
    if (!account.activities.length) {
      alert('Não há atividades para apagar.');
      return;
    }
    modal.classList.remove('hidden');
  });

  document.querySelector('#cancel-delete').addEventListener('click', () => modal.classList.add('hidden'));
  document.querySelector('#confirm-delete').addEventListener('click', async () => {
    try {
      const result = await apiRequest(`/api/accounts/${session.accountId}/activities`, { method: 'DELETE' });
      account.activities = result.activities;
      renderActivities();
      modal.classList.add('hidden');
    } catch (error) {
      alert(error.message);
    }
  });
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.classList.add('hidden');
  });
  document.querySelector('#logout-button').addEventListener('click', logout);
  apiRequest(`/api/accounts/${session.accountId}`).then((result) => {
    account = result;
    document.querySelector('#account-title').textContent = `Relatório de ${account.name}`;
    renderActivities();
  }).catch(() => logout());
});
