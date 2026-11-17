# Daily Diet

Projeto da disciplina Programação para WEB II.

Sistema para cadastrar usuários e registrar refeições, usando **React + Node.js + Express + SQLite**. Tem cadastro e login, listagem, criação, detalhes, edição e exclusão de refeições, além de quatro métricas. Cada usuário acessa apenas suas próprias refeições.

## Requisitos

- Node.js **22.13 ou mais recente** (funciona com Node.js 26).
- npm instalado.

O banco usa o `node:sqlite` incluído no Node.js: **não precisa instalar better-sqlite3**, que causou erros de compilação na versão anterior.

## Executar

Abra a pasta do projeto no VS Code e rode na pasta principal:

```bash
npm run setup
npm run dev
```

Abra **http://localhost:5173** no navegador. Cadastre-se e comece a registrar refeições.

O backend funciona em `http://localhost:3333/api` e cria o banco automaticamente. Para parar a execução, use `Ctrl+C` no terminal.

### Em caso de problema

Se o terminal informar que a porta já está sendo usada, encerre os terminais antigos com `Ctrl+C` e tente novamente.

Se preferir iniciar os servidores separadamente, abra dois terminais:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

## API

| Método | Rota | Ação |
|---|---|---|
| POST | `/api/users` | Criar conta |
| POST | `/api/sessions` | Entrar |
| GET | `/api/meals` | Listar refeições |
| POST | `/api/meals` | Cadastrar refeição |
| GET | `/api/meals/:id` | Ver uma refeição |
| PUT | `/api/meals/:id` | Editar refeição |
| DELETE | `/api/meals/:id` | Excluir refeição |
| GET | `/api/metrics` | Ver métricas |

As rotas de refeições e métricas exigem o token do usuário autenticado (`Authorization: Bearer ...`).

## Testes

```bash
npm test
npm run build
```

## Entrega

Publique as pastas `frontend` e `backend`, o `package.json` principal e o `README.md` em um **repositório público no GitHub**. Não envie `node_modules`, `.env` nem o banco de dados. O `.gitignore` já os exclui.
