import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProfessorDto } from './professor.dto';

@Injectable()
export class ProfessoresService {
  constructor(private prisma: PrismaService) {}

  listar() {
    return this.prisma.professor.findMany({ orderBy: { nome: 'asc' } });
  }

  async buscar(id: number) {
    const p = await this.prisma.professor.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Professor não encontrado');
    return p;
  }

  criar(dto: ProfessorDto) {
    return this.prisma.professor.create({ data: dto });
  }

  async atualizar(id: number, dto: ProfessorDto) {
    await this.buscar(id);
    return this.prisma.professor.update({ where: { id }, data: dto });
  }

  async remover(id: number) {
    await this.buscar(id);
    return this.prisma.professor.delete({ where: { id } });
  }
}
