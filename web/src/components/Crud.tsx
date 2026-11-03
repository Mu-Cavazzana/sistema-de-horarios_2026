"use client";
// Tabela + formulario generico de cadastro. Serve pra Professor, UC e Turma.
import { api } from "@/lib/api";
import { FormEvent, useCallback, useEffect, useState } from "react";

export type Campo<T> = {
  nome: keyof T & string;
  rotulo: string;
  tipo?: "text" | "email" | "number";
  opcoes?: readonly string[]; // vira <select>
};

type Props<T> = { titulo: string; rota: string; campos: Campo<T>[] };

export default function Crud<T extends { id: number }>({ titulo, rota, campos }: Props<T>) {
  const [itens, setItens] = useState<T[]>([]);
  const [editando, setEditando] = useState<T | null>(null);
  const [erro, setErro] = useState("");

  const carregar = useCallback(() => api<T[]>(rota).then(setItens).catch((e) => setErro(e.message)), [rota]);
  useEffect(() => {
    carregar();
  }, [carregar]);

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    const form = e.currentTarget;
    const valores = new FormData(form);
    const dados = Object.fromEntries(
      campos.map((c) => {
        const v = valores.get(c.nome) as string;
        return [c.nome, c.tipo === "number" ? Number(v) : v];
      }),
    );
    try {
      if (editando) await api(`${rota}/${editando.id}`, { method: "PUT", json: dados });
      else await api(rota, { method: "POST", json: dados });
      form.reset();
      setEditando(null);
      carregar();
    } catch (err) {
      setErro((err as Error).message);
    }
  }

  async function excluir(item: T) {
    if (!confirm("Excluir este registro? Os horários ligados a ele também serão removidos.")) return;
    try {
      await api(`${rota}/${item.id}`, { method: "DELETE" });
      carregar();
    } catch (err) {
      setErro((err as Error).message);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{titulo}</h1>

      <form key={editando?.id ?? "novo"} onSubmit={salvar} className="card grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
        {campos.map((c) => (
          <label key={c.nome} className="block text-sm">
            {c.rotulo}
            {c.opcoes ? (
              <select name={c.nome} className="input mt-1" defaultValue={editando ? String(editando[c.nome]) : c.opcoes[0]}>
                {c.opcoes.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name={c.nome}
                type={c.tipo ?? "text"}
                required
                min={c.tipo === "number" ? 1 : undefined}
                className="input mt-1"
                defaultValue={editando ? String(editando[c.nome]) : ""}
              />
            )}
          </label>
        ))}
        <div className="flex items-end gap-2">
          <button className="btn">{editando ? "Salvar" : "Cadastrar"}</button>
          {editando && (
            <button type="button" className="btn-ghost" onClick={() => setEditando(null)}>
              Cancelar
            </button>
          )}
        </div>
        {erro && <p className="text-sm text-red-600 sm:col-span-4">{erro}</p>}
      </form>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              {campos.map((c) => (
                <th key={c.nome} className="px-4 py-2 font-medium">
                  {c.rotulo}
                </th>
              ))}
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {itens.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                {campos.map((c) => (
                  <td key={c.nome} className="px-4 py-2">
                    {String(item[c.nome])}
                  </td>
                ))}
                <td className="px-4 py-2 text-right whitespace-nowrap">
                  <button className="btn-ghost mr-2" onClick={() => setEditando(item)}>
                    Editar
                  </button>
                  <button className="btn-danger" onClick={() => excluir(item)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {itens.length === 0 && (
              <tr>
                <td colSpan={campos.length + 1} className="px-4 py-6 text-center text-slate-500">
                  Nenhum registro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
