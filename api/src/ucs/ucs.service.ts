import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UcDto } from './uc.dto';

@Injectable()
export class UcsService {
  constructor(private prisma: PrismaService) {}

  listar() {
    return this.prisma.uc.findMany({ orderBy: { nome: 'asc' } });
  }

  async buscar(id: number) {
    const uc = await this.prisma.uc.findUnique({ where: { id } });
    if (!uc) throw new NotFoundException('UC não encontrada');
    return uc;
  }

  criar(dto: UcDto) {
    return this.prisma.uc.create({ data: dto });
  }

  async atualizar(id: number, dto: UcDto) {
    await this.buscar(id);
    return this.prisma.uc.update({ where: { id }, data: dto });
  }

  async remover(id: number) {
    await this.buscar(id);
    return this.prisma.uc.delete({ where: { id } });
  }
}
