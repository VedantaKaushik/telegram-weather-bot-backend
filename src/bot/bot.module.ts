import { Module } from '@nestjs/common';
import { botController } from './bot.controller';
import { BotService } from './bot.service';

@Module({
  controllers: [botController],
  providers: [BotService],
})
export class BotModule {}
