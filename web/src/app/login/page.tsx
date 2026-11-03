"use client";
import { api, token } from "@/lib/api";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    const form = new FormData(e.currentTarget);
    try {
      const r = await api<{ token: string }>("/auth/login", {
        method: "POST",
        json: { email: form.get("email"), senha: form.get("senha") },
      });
      token.set(r.token);
      router.push("/horarios");
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={entrar} className="card w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Sistema de Horários</h1>
        <label className="block text-sm">
          E-mail
          <input name="email" type="email" required className="input mt-1" defaultValue="admin@unifil.br" />
        </label>
        <label className="block text-sm">
          Senha
          <input name="senha" type="password" required minLength={6} className="input mt-1" />
        </label>
        {erro && <p className="text-sm text-red-600">{erro}</p>}
        <button className="btn w-full justify-center" disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
