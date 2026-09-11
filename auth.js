const sessionKey = 'gerador-relatorio-sessao';

function getSession() {
  return JSON.parse(sessionStorage.getItem(sessionKey) || 'null');
}

function setSession(session) {
  sessionStorage.setItem(sessionKey, JSON.stringify(session));
}

function clearSession() {
  sessionStorage.removeItem(sessionKey);
}

function logout() {
  clearSession();
  window.location.href = 'login.html';
}

function requireRole(role) {
  const session = getSession();
  if (!session || session.role !== role) {
    window.location.href = 'login.html';
    return null;
  }
  return session;
}

async function apiRequest(url, options = {}) {
  const session = getSession();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (session?.token) headers.Authorization = `Bearer ${session.token}`;
  const response = await fetch(url, { ...options, headers });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || 'Não foi possível concluir a operação.');
  return body;
}
