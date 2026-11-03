"use client";
import { token } from "@/lib/api";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/horarios", label: "Horários" },
  { href: "/turmas", label: "Turmas" },
  { href: "/ucs", label: "UCs" },
  { href: "/professores", label: "Professores" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    if (!token.get()) router.replace("/login");
    else setPronto(true);
  }, [router]);

  if (!pronto) return null;

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-1 px-4 py-2">
          <span className="mr-4 font-semibold">Sistema de Horários</span>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-md px-3 py-1.5 text-sm ${pathname.startsWith(l.href) ? "bg-blue-600 text-white" : "hover:bg-slate-100"}`}
            >
              {l.label}
            </Link>
          ))}
          <button
            className="ml-auto text-sm text-slate-500 hover:text-slate-900"
            onClick={() => {
              token.clear();
              router.replace("/login");
            }}
          >
            Sair
          </button>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl p-4">{children}</main>
    </div>
  );
}
