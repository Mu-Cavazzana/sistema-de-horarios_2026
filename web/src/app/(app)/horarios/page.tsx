"use client";
// Grade semanal da turma: 6 dias x 2 blocos. Clicar numa celula abre o formulario do slot.
import { api, Horario, Professor, Turma, Uc } from "@/lib/api";
import { FormEvent, useCallback, useEffect, useState } from "react";

const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const BLOCOS = ["1ª aula", "2ª aula"];

export default function HorariosPage() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [ucs, setUcs] = useState<Uc[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [turmaId, setTurmaId] = useState<number>(0);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [slot, setSlot] = useState<{ diaSemana: number; bloco: number } | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    Promise.all([api<Turma[]>("/turmas"), api<Uc[]>("/ucs"), api<Professor[]>("/professores")])
      .then(([t, u, p]) => {
        setTurmas(t);
        setUcs(u);
        setProfessores(p);
        if (t[0]) setTurmaId(t[0].id);
      })
      .catch((e) => setErro(e.message));
  }, []);

  const carregar = useCallback(() => {
    if (!turmaId) return;
    api<Horario[]>(`/horarios?turmaId=${turmaId}`).then(setHorarios).catch((e) => setErro(e.message));
  }, [turmaId]);
  useEffect(() => {
    carregar();
  }, [carregar]);

  const aulaEm = (dia: number, bloco: number) => horarios.find((h) => h.diaSemana === dia && h.bloco === bloco);
  const atual = slot && aulaEm(slot.diaSemana, slot.bloco);

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!slot) return;
    setErro("");
    const f = new FormData(e.currentTarget);
    const dados = { ...slot, turmaId, ucId: Number(f.get("ucId")), professorId: Number(f.get("professorId")) };
    try {
      if (atual) await api(`/horarios/${atual.id}`, { method: "PUT", json: dados });
      else await api("/horarios", { method: "POST", json: dados });
      setSlot(null);
      carregar();
    } catch (err) {
      setErro((err as Error).message);
    }
  }

  async function remover() {
    if (!atual || !confirm("Remover esta aula da grade?")) return;
    await api(`/horarios/${atual.id}`, { method: "DELETE" });
    setSlot(null);
    carregar();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <h1 className="text-xl font-semibold">Grade de horários</h1>
        <select className="input w-auto" value={turmaId} onChange={(e) => setTurmaId(Number(e.target.value))}>
          {turmas.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nome} ({t.periodo})
            </option>
          ))}
        </select>
        <button className="btn-ghost" onClick={() => window.print()}>
          Imprimir / PDF
        </button>
      </div>

      {turmas.length === 0 && <p className="text-slate-500">Cadastre uma turma primeiro.</p>}
      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2 text-left">Horário</th>
              {DIAS.map((d) => (
                <th key={d} className="px-3 py-2 text-left">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BLOCOS.map((b, bi) => (
              <tr key={b} className="border-t border-slate-100">
                <td className="px-3 py-2 font-medium">{b}</td>
                {DIAS.map((_, di) => {
                  const h = aulaEm(di + 1, bi + 1);
                  const estilo = h
                    ? "border-blue-200 bg-blue-50 hover:bg-blue-100"
                    : "border-dashed border-slate-300 text-slate-400 hover:bg-slate-50";
                  return (
                    <td key={di} className="p-1 align-top">
                      <button
                        onClick={() => setSlot({ diaSemana: di + 1, bloco: bi + 1 })}
                        className={"block h-20 w-full rounded-md border p-2 text-left text-xs " + estilo}
                      >
                        {h ? (
                          <>
                            <span className="block font-semibold text-slate-800">{h.uc.nome}</span>
                            <span className="block text-slate-600">{h.professor.nome}</span>
                          </>
                        ) : (
                          "+ adicionar"
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {slot && (
        <form onSubmit={salvar} className="card space-y-3 print:hidden">
          <h2 className="font-medium">
            {DIAS[slot.diaSemana - 1]}, {BLOCOS[slot.bloco - 1]}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              UC
              <select name="ucId" className="input mt-1" defaultValue={atual?.ucId} required>
                {ucs.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.codigo} - {u.nome}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Professor
              <select name="professorId" className="input mt-1" defaultValue={atual?.professorId} required>
                {professores.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex gap-2">
            <button className="btn">Salvar</button>
            <button type="button" className="btn-ghost" onClick={() => setSlot(null)}>
              Cancelar
            </button>
            {atual && (
              <button type="button" className="btn-danger ml-auto" onClick={remover}>
                Remover aula
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
