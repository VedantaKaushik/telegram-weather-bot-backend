import { Controller, Get } from '@nestjs/common';
import { BotService } from './bot.service';

@Controller()
export class botController {
  constructor(private readonly bot: BotService) {}

  @Get('/')
  botStart() {
    return this.bot.botStart();
  }
}
