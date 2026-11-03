// Cliente HTTP da API. Guarda o token JWT no localStorage e redireciona pro login quando expira.
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const token = {
  get: () => (typeof window === "undefined" ? null : localStorage.getItem("token")),
  set: (t: string) => localStorage.setItem("token", t),
  clear: () => localStorage.removeItem("token"),
};

export async function api<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const res = await fetch(API + path, {
    ...init,
    headers: { "content-type": "application/json", authorization: `Bearer ${token.get() ?? ""}`, ...init.headers },
    body: init.json !== undefined ? JSON.stringify(init.json) : init.body,
  });
  if (res.status === 401 && !path.startsWith("/auth/login")) {
    token.clear();
    window.location.href = "/login";
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = Array.isArray(data?.message) ? data.message.join(", ") : data?.message ?? res.statusText;
    throw new ApiError(res.status, msg);
  }
  return data as T;
}

export type Professor = { id: number; nome: string; email: string };
export type Uc = { id: number; nome: string; codigo: string; cargaHoraria: number };
export type Turma = { id: number; nome: string; periodo: "MANHA" | "TARDE" | "NOITE" };
export type Horario = {
  id: number;
  diaSemana: number;
  bloco: number;
  turmaId: number;
  ucId: number;
  professorId: number;
  turma: Turma;
  uc: Uc;
  professor: Professor;
};
