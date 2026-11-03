import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC } from './public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwt: JwtService, private reflector: Reflector) {}

  async canActivate(ctx: ExecutionContext) {
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [ctx.getHandler(), ctx.getClass()])) return true;
    const req = ctx.switchToHttp().getRequest<Request & { usuario?: unknown }>();
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException();
    try {
      req.usuario = await this.jwt.verifyAsync(token);
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
