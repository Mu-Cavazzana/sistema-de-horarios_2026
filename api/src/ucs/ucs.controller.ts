import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UcDto } from './uc.dto';
import { UcsService } from './ucs.service';

@Controller('ucs')
export class UcsController {
  constructor(private service: UcsService) {}

  @Get() listar() { return this.service.listar(); }
  @Get(':id') buscar(@Param('id', ParseIntPipe) id: number) { return this.service.buscar(id); }
  @Post() criar(@Body() dto: UcDto) { return this.service.criar(dto); }
  @Put(':id') atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: UcDto) { return this.service.atualizar(id, dto); }
  @Delete(':id') remover(@Param('id', ParseIntPipe) id: number) { return this.service.remover(id); }
}
