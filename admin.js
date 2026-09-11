document.addEventListener('DOMContentLoaded', () => {
  if (!requireRole('admin')) return;

  const form = document.querySelector('#account-form');
  const message = document.querySelector('#account-message');
  const list = document.querySelector('#account-list');

  async function renderAccounts() {
    const { accounts } = await apiRequest('/api/accounts');
    list.innerHTML = '';
    if (!accounts.length) {
      const empty = document.createElement('p');
      empty.className = 'empty-message';
      empty.textContent = 'Nenhuma conta pessoal cadastrada.';
      list.appendChild(empty);
      return;
    }

    accounts.forEach((account) => {
      const item = document.createElement('div');
      item.className = 'account-list-item';
      const details = document.createElement('div');
      const name = document.createElement('strong');
      const username = document.createElement('span');
      const activityCount = document.createElement('span');
      name.textContent = account.name;
      username.textContent = `Usuário: ${account.username}`;
      activityCount.textContent = `${account.activityCount} atividade(s)`;
      details.append(name, username);
      item.append(details, activityCount);
      list.appendChild(item);
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.querySelector('#account-name').value.trim();
    const username = document.querySelector('#account-username').value.trim();
    const password = document.querySelector('#account-password').value;

    try {
      await apiRequest('/api/accounts', {
        method: 'POST',
        body: JSON.stringify({ name, username, password }),
      });
      form.reset();
      message.className = 'form-message success-message';
      message.textContent = 'Conta cadastrada com sucesso.';
      await renderAccounts();
    } catch (error) {
      message.className = 'form-message';
      message.textContent = error.message;
    }
  });

  document.querySelector('#logout-button').addEventListener('click', logout);
  renderAccounts().catch((error) => {
    message.textContent = error.message;
    const errorItem = document.createElement('p');
    errorItem.className = 'form-message';
    errorItem.textContent = `Não foi possível carregar as contas: ${error.message}`;
    list.replaceChildren(errorItem);
  });
});
