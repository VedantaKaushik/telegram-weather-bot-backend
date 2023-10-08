import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [BotModule, AdminModule],
})
export class AppModule {}
