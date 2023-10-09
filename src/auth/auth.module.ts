import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { authController } from './auth.controller';

@Module({
  controllers: [authController],
  providers: [AuthService],
})
export class AuthModule {}
