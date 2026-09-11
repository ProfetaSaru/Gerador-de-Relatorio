# Gerador de Relatório

Aplicação com páginas estáticas e API serverless para a Vercel.

## Deploy na Vercel

1. Importe este projeto na Vercel.
2. Crie ou conecte um banco **Vercel Postgres** ao projeto.
3. Configure estas variáveis de ambiente:

```text
SESSION_SECRET=um-segredo-longo-e-aleatorio
ADMIN_USERNAME=admin
ADMIN_PASSWORD=troque-esta-senha
```

O banco cria as tabelas automaticamente na primeira requisição. A aplicação usa o mesmo domínio para as páginas e para a API:

```text
/login.html
/admin.html
/painel.html
/api/login
```

Para testar localmente, instale a CLI da Vercel e execute:

```powershell
npm install
npx vercel dev
```

O comando `vercel dev` precisa receber as variáveis de ambiente e a conexão do banco para reproduzir o ambiente de produção.