import { IsInt, Max, Min } from 'class-validator';

export class HorarioDto {
  @IsInt() @Min(1) @Max(6) diaSemana: number; // 1 = segunda ... 6 = sabado
  @IsInt() @Min(1) @Max(2) bloco: number; // 1 = primeira aula, 2 = segunda aula
  @IsInt() turmaId: number;
  @IsInt() ucId: number;
  @IsInt() professorId: number;
}
