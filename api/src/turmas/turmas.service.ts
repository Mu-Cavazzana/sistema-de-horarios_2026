import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TurmaDto } from './turma.dto';

@Injectable()
export class TurmasService {
  constructor(private prisma: PrismaService) {}

  listar() {
    return this.prisma.turma.findMany({ orderBy: { nome: 'asc' } });
  }

  async buscar(id: number) {
    const t = await this.prisma.turma.findUnique({ where: { id } });
    if (!t) throw new NotFoundException('Turma não encontrada');
    return t;
  }

  criar(dto: TurmaDto) {
    return this.prisma.turma.create({ data: dto });
  }

  async atualizar(id: number, dto: TurmaDto) {
    await this.buscar(id);
    return this.prisma.turma.update({ where: { id }, data: dto });
  }

  async remover(id: number) {
    await this.buscar(id);
    return this.prisma.turma.delete({ where: { id } });
  }
}
