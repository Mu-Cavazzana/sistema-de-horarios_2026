import Crud from "@/components/Crud";
import { Uc } from "@/lib/api";

export default function UcsPage() {
  return (
    <Crud<Uc>
      titulo="Unidades Curriculares"
      rota="/ucs"
      campos={[
        { nome: "nome", rotulo: "Nome" },
        { nome: "codigo", rotulo: "Código" },
        { nome: "cargaHoraria", rotulo: "Carga horária (h)", tipo: "number" },
      ]}
    />
  );
}
