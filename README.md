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

### Passo a Passo

1. **Criar Banco de Dados Postgres**

   - No dashboard da Vercel, vá em **Storage → Create Database**
   - Selecione **Postgres** e crie

2. **Criar Blob Storage (para uploads)**

   - No dashboard da Vercel, vá em **Storage → Create Database**
   - Selecione **Blob** e crie
   - Conecte ao seu projeto (isso adiciona `BLOB_READ_WRITE_TOKEN` automaticamente)

3. **Configurar Variáveis de Ambiente**

   - A variável `POSTGRES_URL` já foi adicionada automaticamente
   - Adicione manualmente:
     ```
     JWT_SECRET=irJArDz8rbSHglT46nlJgtxiQmi89xH+BILvPClUBGA=
     JWT_EXPIRES_IN=1d
     ```

4. **Deploy**

   - Push para GitHub
   - Importe o projeto na Vercel
   - Deploy automático

5. **Inicializar Banco**
   - Acesse `https://seu-dominio.vercel.app/api/database/reset`
   - Isso criará as tabelas e dados iniciais

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
