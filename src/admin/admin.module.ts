import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { adminService } from './admin.service';

@Module({
  controllers: [AdminController],
  providers: [adminService],
})
export class AdminModule {}
