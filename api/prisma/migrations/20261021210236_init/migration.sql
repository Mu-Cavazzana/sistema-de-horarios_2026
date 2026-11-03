-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Professor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Uc" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "cargaHoraria" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Turma" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "periodo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Horario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "diaSemana" INTEGER NOT NULL,
    "bloco" INTEGER NOT NULL,
    "turmaId" INTEGER NOT NULL,
    "ucId" INTEGER NOT NULL,
    "professorId" INTEGER NOT NULL,
    CONSTRAINT "Horario_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "Turma" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Horario_ucId_fkey" FOREIGN KEY ("ucId") REFERENCES "Uc" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Horario_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_email_key" ON "Professor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Uc_codigo_key" ON "Uc"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Turma_nome_key" ON "Turma"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Horario_turmaId_diaSemana_bloco_key" ON "Horario"("turmaId", "diaSemana", "bloco");

-- CreateIndex
CREATE UNIQUE INDEX "Horario_professorId_diaSemana_bloco_key" ON "Horario"("professorId", "diaSemana", "bloco");
