import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [BotModule, AdminModule, AuthModule, ConfigModule.forRoot()],
})
export class AppModule {}
