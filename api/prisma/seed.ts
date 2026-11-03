import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.usuario.upsert({
    where: { email: 'admin@unifil.br' },
    update: {},
    create: { nome: 'Coordenador', email: 'admin@unifil.br', senha: hashSync('admin123', 10) },
  });
  const [p1, p2] = await Promise.all([
    prisma.professor.upsert({ where: { email: 'ana@unifil.br' }, update: {}, create: { nome: 'Ana Souza', email: 'ana@unifil.br' } }),
    prisma.professor.upsert({ where: { email: 'carlos@unifil.br' }, update: {}, create: { nome: 'Carlos Lima', email: 'carlos@unifil.br' } }),
  ]);
  const [u1, u2] = await Promise.all([
    prisma.uc.upsert({ where: { codigo: 'BD2' }, update: {}, create: { nome: 'Banco de Dados Avançado', codigo: 'BD2', cargaHoraria: 80 } }),
    prisma.uc.upsert({ where: { codigo: 'PDS2' }, update: {}, create: { nome: 'Projeto de Desenvolvimento de Software II', codigo: 'PDS2', cargaHoraria: 80 } }),
  ]);
  const t = await prisma.turma.upsert({ where: { nome: 'ADS 4º semestre' }, update: {}, create: { nome: 'ADS 4º semestre', periodo: 'NOITE' } });
  await prisma.horario.createMany({
    data: [
      { diaSemana: 1, bloco: 1, turmaId: t.id, ucId: u1.id, professorId: p1.id },
      { diaSemana: 1, bloco: 2, turmaId: t.id, ucId: u2.id, professorId: p2.id },
    ],
  }).catch(() => undefined); // ja semeado
}

main().finally(() => prisma.$disconnect());
