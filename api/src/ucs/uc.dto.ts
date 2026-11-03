import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class UcDto {
  @IsString() @MinLength(2) nome: string;
  @IsString() @MinLength(2) codigo: string;
  @IsInt() @Min(1) cargaHoraria: number;
}
