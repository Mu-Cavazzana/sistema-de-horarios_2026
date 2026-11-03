import { IsEmail, IsString, MinLength } from 'class-validator';

export class ProfessorDto {
  @IsString() @MinLength(2) nome: string;
  @IsEmail() email: string;
}
