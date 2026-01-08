# Sistema de Gerenciamento

Aplicação web completa para gerenciamento de conteúdo administrativo desenvolvida com Next.js 14 e TypeScript.

## Tecnologias Utilizadas

- Next.js 14 (App Router)
- TypeScript
- Vercel Postgres
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

## Deploy na Vercel

Veja instruções completas em [VERCEL_DEPLOY.md](VERCEL_DEPLOY.md)

### Resumo

1. Crie um banco Vercel Postgres
2. Configure as variáveis de ambiente (automático + JWT_SECRET)
3. Faça deploy
4. Acesse para inicializar o banco

### Credenciais Padrão

- Email: admin@unooba.com.br
- Senha: admin123

## Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente (veja .env.example)
# Para usar banco da Vercel:
vercel env pull .env.local

# Rodar em desenvolvimento
npm run dev
```

## Configuração

Copie `.env.example` para `.env.local` e preencha:

## Funcionalidades

- Autenticação com JWT
- Gerenciamento de notícias
- Upload de imagens
- Painel administrativo
- Banco de dados Postgres (Vercel)

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

Postgres (Vercel) com as seguintes tabelas:

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
