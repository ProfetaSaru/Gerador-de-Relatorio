document.addEventListener('DOMContentLoaded', () => {
  const existingSession = getSession();
  if (existingSession?.role === 'admin') window.location.href = 'admin.html';
  if (existingSession?.role === 'account') window.location.href = 'painel.html';

  const form = document.querySelector('#login-form');
  const message = document.querySelector('#login-message');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.querySelector('#username').value.trim();
    const password = document.querySelector('#password').value;

    try {
      const session = await apiRequest('/api/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      setSession(session);
      window.location.href = session.role === 'admin' ? 'admin.html' : 'painel.html';
    } catch (error) {
      message.textContent = error.message;
    }
  });
});
