import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class adminService {
  OnModuleInit() {
    prisma.$connect();
  }

  // Get all users
  async getAllUsers() {
    // Getting all users
    const users = await prisma.users.findMany();

    // sending the users
    return users;
  }

  //   Suspend a users account
  async suspendUser(body: { username: string; status: boolean }) {
    const { username, status } = body;

    // Getting the info from body
    let updated_value: boolean;

    if (status) {
      updated_value = false;
    }
    if (!status) {
      updated_value = true;
    }

    // Updating data
    const updated = await prisma.users.update({
      where: {
        username: username,
      },
      data: {
        isSubscribed: updated_value,
      },
    });

    // Returning updated user
    return updated;
  }

  // Deleting the user
  async delUser(body: { username: string }) {
    const { username } = body;

    // finding and deleting the user
    const delete_user = await prisma.users.delete({
      where: {
        username: username,
      },
    });

    if (delete_user != null) {
      return 'Sucessfully Deleted';
    }
  }
}
