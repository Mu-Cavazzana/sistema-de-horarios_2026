import Crud from "@/components/Crud";
import { Turma } from "@/lib/api";

export default function TurmasPage() {
  return (
    <Crud<Turma>
      titulo="Turmas"
      rota="/turmas"
      campos={[
        { nome: "nome", rotulo: "Nome" },
        { nome: "periodo", rotulo: "Período", opcoes: ["MANHA", "TARDE", "NOITE"] },
      ]}
    />
  );
}
