import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.senha);
  }

  @Get('me')
  me(@Request() req: { usuario: unknown }) {
    return req.usuario;
  }
}
