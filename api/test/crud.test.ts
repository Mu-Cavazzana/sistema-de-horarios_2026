// Teste ponta a ponta: sobe a API antes (npm run build && npm start) e rode `npm test`.
import assert from 'node:assert/strict';

const API = process.env.API_URL ?? 'http://localhost:3001';
let token = '';

async function api(method: string, path: string, body?: unknown) {
  const res = await fetch(API + path, {
    method,
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, data: await res.json().catch(() => null) };
}

async function main() {
  const sufixo = Date.now();

  // sem token -> 401
  assert.equal((await api('GET', '/professores')).status, 401);

  // login
  const login = await api('POST', '/auth/login', { email: 'admin@unifil.br', senha: 'admin123' });
  assert.equal(login.status, 201);
  token = login.data.token;
  assert.equal((await api('POST', '/auth/login', { email: 'admin@unifil.br', senha: 'errada' })).status, 401);

  // CRUD professor
  const prof = await api('POST', '/professores', { nome: 'Teste', email: `t${sufixo}@unifil.br` });
  assert.equal(prof.status, 201);
  assert.equal((await api('POST', '/professores', { nome: 'X', email: 'nao-e-email' })).status, 400);
  const prof2 = await api('PUT', `/professores/${prof.data.id}`, { nome: 'Teste Editado', email: prof.data.email });
  assert.equal(prof2.data.nome, 'Teste Editado');

  // CRUD uc e turma
  const uc = await api('POST', '/ucs', { nome: 'UC Teste', codigo: `UC${sufixo}`, cargaHoraria: 40 });
  assert.equal(uc.status, 201);
  const turma = await api('POST', '/turmas', { nome: `Turma ${sufixo}`, periodo: 'NOITE' });
  assert.equal(turma.status, 201);
  assert.equal((await api('POST', '/turmas', { nome: 'T', periodo: 'MADRUGADA' })).status, 400);

  // horario + regras de conflito
  const slot = { diaSemana: 3, bloco: 1, turmaId: turma.data.id, ucId: uc.data.id, professorId: prof.data.id };
  const h = await api('POST', '/horarios', slot);
  assert.equal(h.status, 201);
  assert.equal(h.data.professor.nome, 'Teste Editado');
  const conflitoTurma = await api('POST', '/horarios', slot);
  assert.equal(conflitoTurma.status, 409);
  const outraTurma = await api('POST', '/turmas', { nome: `Turma B ${sufixo}`, periodo: 'NOITE' });
  const conflitoProf = await api('POST', '/horarios', { ...slot, turmaId: outraTurma.data.id });
  assert.equal(conflitoProf.status, 409);
  assert.match(conflitoProf.data.message, /professor/i);
  const lista = await api('GET', `/horarios?turmaId=${turma.data.id}`);
  assert.equal(lista.data.length, 1);

  // delete em cascata: apagar a turma apaga o horario
  assert.equal((await api('DELETE', `/turmas/${turma.data.id}`)).status, 200);
  assert.equal((await api('GET', `/horarios/${h.data.id}`)).status, 404);
  await api('DELETE', `/turmas/${outraTurma.data.id}`);
  await api('DELETE', `/ucs/${uc.data.id}`);
  await api('DELETE', `/professores/${prof.data.id}`);
  assert.equal((await api('GET', `/professores/${prof.data.id}`)).status, 404);

  console.log('OK: todos os testes passaram');
}

main().catch((e) => { console.error(e); process.exit(1); });
