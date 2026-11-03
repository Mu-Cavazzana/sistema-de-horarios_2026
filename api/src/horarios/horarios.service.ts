import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { HorarioDto } from './horario.dto';

const incluir = { turma: true, uc: true, professor: true };

@Injectable()
export class HorariosService {
  constructor(private prisma: PrismaService) {}

  listar(turmaId?: number) {
    return this.prisma.horario.findMany({
      where: turmaId ? { turmaId } : undefined,
      include: incluir,
      orderBy: [{ diaSemana: 'asc' }, { bloco: 'asc' }],
    });
  }

  async buscar(id: number) {
    const h = await this.prisma.horario.findUnique({ where: { id }, include: incluir });
    if (!h) throw new NotFoundException('Horário não encontrado');
    return h;
  }

  criar(dto: HorarioDto) {
    return this.traduzirErro(() => this.prisma.horario.create({ data: dto, include: incluir }));
  }

  async atualizar(id: number, dto: HorarioDto) {
    await this.buscar(id);
    return this.traduzirErro(() => this.prisma.horario.update({ where: { id }, data: dto, include: incluir }));
  }

  async remover(id: number) {
    await this.buscar(id);
    return this.prisma.horario.delete({ where: { id } });
  }

  // As regras "turma so tem uma aula por slot" e "professor so da uma aula por slot"
  // sao garantidas pelos indices unicos do banco; aqui so traduzimos o erro.
  private async traduzirErro<T>(fn: () => Promise<T>) {
    try {
      return await fn();
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          const campos = String((e.meta as { target?: string[] })?.target ?? '');
          throw new ConflictException(
            campos.includes('professorId')
              ? 'O professor já tem aula nesse dia e horário'
              : 'A turma já tem aula nesse dia e horário',
          );
        }
        if (e.code === 'P2003') throw new NotFoundException('Turma, UC ou professor não encontrado');
      }
      throw e;
    }
  }
}
