import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProfessorDto } from './professor.dto';
import { ProfessoresService } from './professores.service';

@Controller('professores')
export class ProfessoresController {
  constructor(private service: ProfessoresService) {}

  @Get() listar() { return this.service.listar(); }
  @Get(':id') buscar(@Param('id', ParseIntPipe) id: number) { return this.service.buscar(id); }
  @Post() criar(@Body() dto: ProfessorDto) { return this.service.criar(dto); }
  @Put(':id') atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: ProfessorDto) { return this.service.atualizar(id, dto); }
  @Delete(':id') remover(@Param('id', ParseIntPipe) id: number) { return this.service.remover(id); }
}
