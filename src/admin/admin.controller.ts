import { Controller, Get, Post, Body } from '@nestjs/common';
import { adminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private admin: adminService) {}

  //   Get All Users
  @Get('get')
  getAllUsers() {
    return this.admin.getAllUsers();
  }

  //   Suspending a user account
  @Post('suspend')
  suspendUser(@Body() body: { username: string; status: boolean }) {
    return this.admin.suspendUser(body);
  }

  @Post('del')
  delUser(@Body() body: { username: string }) {
    return this.admin.delUser(body);
  }
}
