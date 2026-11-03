import Crud from "@/components/Crud";
import { Professor } from "@/lib/api";

export default function ProfessoresPage() {
  return (
    <Crud<Professor>
      titulo="Professores"
      rota="/professores"
      campos={[
        { nome: "nome", rotulo: "Nome" },
        { nome: "email", rotulo: "E-mail", tipo: "email" },
      ]}
    />
  );
}
