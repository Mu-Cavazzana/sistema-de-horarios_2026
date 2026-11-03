import { IsIn, IsString, MinLength } from 'class-validator';

export const PERIODOS = ['MANHA', 'TARDE', 'NOITE'] as const;

export class TurmaDto {
  @IsString() @MinLength(2) nome: string;
  @IsIn(PERIODOS) periodo: (typeof PERIODOS)[number];
}
