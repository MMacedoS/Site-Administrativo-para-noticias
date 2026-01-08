# Sistema de Gerenciamento

Aplicação web completa para gerenciamento de conteúdo administrativo desenvolvida com Next.js 14 e TypeScript.

## Tecnologias Utilizadas

- Next.js 14 (App Router)
- TypeScript
- SQLite (better-sqlite3)
- JWT para autenticação
- Zod para validação
- Tailwind CSS
- bcryptjs

## Estrutura do Projeto

```
src/
├── domain/              # Entidades e interfaces
│   ├── entities/
│   ├── repositories/
│   └── services/
├── application/         # Casos de uso
│   ├── use-cases/
│   └── validators/
├── infrastructure/      # Implementações
│   ├── database/
│   ├── repositories/
│   ├── services/
│   └── di/
└── app/                # Rotas Next.js
    ├── api/
    ├── auth/
    └── admin/
```

## Como Usar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

## Configuração

Crie um arquivo `.env` na raiz com:

```env
DATABASE_PATH=./data/news.db
JWT_SECRET=sua-chave-secreta-aqui
JWT_EXPIRES_IN=7d
```

## Funcionalidades

- Autenticação com JWT
- Gerenciamento de notícias
- Upload de imagens
- Painel administrativo
- Banco de dados SQLite

## API Endpoints

### Autenticação

- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Fazer login

### Notícias

- `GET /api/news` - Listar
- `GET /api/news/[id]` - Ver detalhes
- `POST /api/news` - Criar (autenticado)
- `PUT /api/news/[id]` - Editar (autenticado)
- `DELETE /api/news/[id]` - Deletar (autenticado)

## Banco de Dados

SQLite com as seguintes tabelas:

**users**

- id, email, password, name, created_at

**news**

- id, title, content, summary, author_id, published, created_at, updated_at

## Build e Deploy

```bash
npm run build
npm start
```

## Licença

MIT
