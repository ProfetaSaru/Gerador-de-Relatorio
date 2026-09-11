const crypto = require('crypto');
const { sql } = require('@vercel/postgres');

const sessionSecret = process.env.SESSION_SECRET || 'desenvolvimento-altere-este-segredo';
const adminUsername = process.env.ADMIN_USERNAME || 'admin';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

function send(response, status, body) {
  response.status(status).json(body);
}

function sign(value) {
  return crypto.createHmac('sha256', sessionSecret).update(value).digest('base64url');
}

function createToken(payload) {
  const encoded = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString('base64url');
  return `${encoded}.${sign(encoded)}`;
}

function getSession(request) {
  const token = request.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature || sign(encoded) !== signature) return null;
  const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
  return payload.exp > Date.now() ? payload : null;
}

function requireSession(request, response, role) {
  const session = getSession(request);
  if (!session || session.role !== role) {
    send(response, 401, { error: 'Não autorizado.' });
    return null;
  }
  return session;
}

async function initializeDatabase() {
  await sql`CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )`;
  await sql`CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    activities JSONB NOT NULL DEFAULT '[]'::jsonb
  )`;
  await sql`
    INSERT INTO app_settings (key, value)
    VALUES ('admin_username', ${adminUsername}), ('admin_password', ${adminPassword})
    ON CONFLICT (key) DO NOTHING
  `;
}

async function getAdmin() {
  const result = await sql`SELECT key, value FROM app_settings WHERE key IN ('admin_username', 'admin_password')`;
  return Object.fromEntries(result.rows.map((row) => [row.key, row.value]));
}

function getAccount(row) {
  return { id: row.id, name: row.name, username: row.username, activities: row.activities || [] };
}

module.exports = async function handler(request, response) {
  try {
    await initializeDatabase();
    const path = new URL(request.url, 'http://localhost').pathname;

    if (request.method === 'POST' && path === '/api/login') {
      const { username, password } = request.body || {};
      const admin = await getAdmin();
      if (username === admin.admin_username && password === admin.admin_password) {
        return send(response, 200, { token: createToken({ role: 'admin' }), role: 'admin' });
      }
      const result = await sql`SELECT id FROM accounts WHERE username = ${username} AND password = ${password}`;
      if (!result.rows.length) return send(response, 401, { error: 'Usuário ou senha inválidos.' });
      const accountId = result.rows[0].id;
      return send(response, 200, { token: createToken({ role: 'account', accountId }), role: 'account', accountId });
    }

    if (request.method === 'GET' && path === '/api/accounts') {
      if (!requireSession(request, response, 'admin')) return;
      const result = await sql`SELECT id, name, username, activities FROM accounts ORDER BY name`;
      return send(response, 200, {
        accounts: result.rows.map((row) => ({ id: row.id, name: row.name, username: row.username, activityCount: (row.activities || []).length })),
      });
    }

    if (request.method === 'POST' && path === '/api/accounts') {
      if (!requireSession(request, response, 'admin')) return;
      const { name, username, password } = request.body || {};
      const admin = await getAdmin();
      if (!name?.trim() || !username?.trim() || !password) return send(response, 400, { error: 'Preencha todos os campos.' });
      if (username === admin.admin_username) return send(response, 409, { error: 'Esse usuário já está em uso.' });
      try {
        await sql`INSERT INTO accounts (id, name, username, password) VALUES (${crypto.randomUUID()}, ${name.trim()}, ${username.trim()}, ${password})`;
      } catch (error) {
        if (error.code === '23505') return send(response, 409, { error: 'Esse usuário já está em uso.' });
        throw error;
      }
      return send(response, 201, { message: 'Conta cadastrada com sucesso.' });
    }

    const accountMatch = path.match(/^\/api\/accounts\/([^/]+)$/);
    if (request.method === 'GET' && accountMatch) {
      const session = requireSession(request, response, 'account');
      if (!session || session.accountId !== accountMatch[1]) return;
      const result = await sql`SELECT id, name, activities FROM accounts WHERE id = ${session.accountId}`;
      if (!result.rows.length) return send(response, 404, { error: 'Conta não encontrada.' });
      return send(response, 200, getAccount(result.rows[0]));
    }

    const activityMatch = path.match(/^\/api\/accounts\/([^/]+)\/activities$/);
    if (activityMatch) {
      const session = requireSession(request, response, 'account');
      if (!session || session.accountId !== activityMatch[1]) return;
      const result = await sql`SELECT activities FROM accounts WHERE id = ${session.accountId}`;
      if (!result.rows.length) return send(response, 404, { error: 'Conta não encontrada.' });
      let activities = result.rows[0].activities || [];
      if (request.method === 'POST') {
        const { start, end, title, description = '' } = request.body || {};
        if (!start || !end || !title) return send(response, 400, { error: 'Preencha os campos obrigatórios.' });
        activities = [...activities, { start, end, title, description }];
      } else if (request.method === 'DELETE') {
        activities = [];
      } else {
        return send(response, 405, { error: 'Método não permitido.' });
      }
      await sql`UPDATE accounts SET activities = ${JSON.stringify(activities)}::jsonb WHERE id = ${session.accountId}`;
      return send(response, 200, { activities });
    }

    return send(response, 404, { error: 'Rota não encontrada.' });
  } catch (error) {
    console.error(error);
    return send(response, 500, { error: 'Erro interno do servidor.' });
  }
};
