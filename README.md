VÍDEO DE DEFESA: https://www.youtube.com/watch?v=Jg0T-BzRqAs

# Sistema de Horários

Sistema web para montar a grade de horários das turmas da UniFil, substituindo as planilhas manuais.
Projeto da disciplina **Projeto de Desenvolvimento de Software II**.

**Autor:** Murilo Cavazzana Ribeiro

## Stack

| Camada   | Tecnologia                                  |
|----------|---------------------------------------------|
| Front    | Next.js 15 (React 19, TypeScript, Tailwind) |
| Back     | NestJS 11 (TypeScript)                      |
| Banco    | SQLite via Prisma ORM                       |
| Auth     | JWT (login com e-mail e senha)              |

## Funcionalidades (casos de uso)

1. Autenticar usuário
2. Gerenciar professores (CRUD)
3. Gerenciar unidades curriculares (CRUD)
4. Gerenciar turmas (CRUD)
5. Montar grade de horários da turma (CRUD de aulas, com validação de conflito de turma e de professor)

## Como rodar

Requisitos: Node.js 22+.

```bash
# API (porta 3001)
cd api
cp .env.example .env
npm install
npx prisma migrate dev      # cria o banco e roda o seed
npm run start:dev

# Web (porta 3000), em outro terminal
cd web
cp .env.example .env.local
npm install
npm run dev
```

Acesse http://localhost:3000 e entre com `admin@unifil.br` / `admin123`.

## Testes

Com a API no ar:

```bash
cd api
npm test
```

Executa um teste ponta a ponta que cobre login, os quatro CRUDs e as regras de conflito da grade.

## Estrutura

```
api/
  prisma/schema.prisma   modelo do banco (DER)
  prisma/seed.ts         dados iniciais
  src/auth/              login e guard JWT
  src/professores/       CRUD
  src/ucs/               CRUD
  src/turmas/            CRUD
  src/horarios/          CRUD da grade + regras de conflito
  test/crud.test.ts      teste ponta a ponta
web/
  src/lib/api.ts         cliente HTTP
  src/components/Crud.tsx tabela + formulário genérico
  src/app/login/         tela de login
  src/app/(app)/         páginas autenticadas
docs/
  documentacao.pdf        documentação do projeto (requisitos, casos de uso, DER)
```

## Documentação

Veja [docs/documentacao.pdf](docs/documentacao.pdf).
