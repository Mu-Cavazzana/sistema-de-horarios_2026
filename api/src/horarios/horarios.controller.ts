import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { HorarioDto } from './horario.dto';
import { HorariosService } from './horarios.service';

@Controller('horarios')
export class HorariosController {
  constructor(private service: HorariosService) {}

  @Get() listar(@Query('turmaId') turmaId?: string) { return this.service.listar(turmaId ? Number(turmaId) : undefined); }
  @Get(':id') buscar(@Param('id', ParseIntPipe) id: number) { return this.service.buscar(id); }
  @Post() criar(@Body() dto: HorarioDto) { return this.service.criar(dto); }
  @Put(':id') atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: HorarioDto) { return this.service.atualizar(id, dto); }
  @Delete(':id') remover(@Param('id', ParseIntPipe) id: number) { return this.service.remover(id); }
}
