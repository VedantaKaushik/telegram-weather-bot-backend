import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class authController {
  constructor(private auth: AuthService) {}

  @Post('login')
  login(@Body() body) {
    return this.auth.login(body.body);
  }
}
