import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { TurmaDto } from './turma.dto';
import { TurmasService } from './turmas.service';

@Controller('turmas')
export class TurmasController {
  constructor(private service: TurmasService) {}

  @Get() listar() { return this.service.listar(); }
  @Get(':id') buscar(@Param('id', ParseIntPipe) id: number) { return this.service.buscar(id); }
  @Post() criar(@Body() dto: TurmaDto) { return this.service.criar(dto); }
  @Put(':id') atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: TurmaDto) { return this.service.atualizar(id, dto); }
  @Delete(':id') remover(@Param('id', ParseIntPipe) id: number) { return this.service.remover(id); }
}
