import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { HorariosModule } from './horarios/horarios.module';
import { PrismaModule } from './prisma.module';
import { ProfessoresModule } from './professores/professores.module';
import { TurmasModule } from './turmas/turmas.module';
import { UcsModule } from './ucs/ucs.module';

@Module({
  imports: [PrismaModule, AuthModule, ProfessoresModule, UcsModule, TurmasModule, HorariosModule],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }], // todas as rotas exigem login, exceto @Public()
})
export class AppModule {}
