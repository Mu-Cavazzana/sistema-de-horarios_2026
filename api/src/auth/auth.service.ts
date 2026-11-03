import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async login(email: string, senha: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { email } });
    if (!usuario || !(await compare(senha, usuario.senha))) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }
    return {
      token: await this.jwt.signAsync({ sub: usuario.id, nome: usuario.nome }),
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    };
  }
}
