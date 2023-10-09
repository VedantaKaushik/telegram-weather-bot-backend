import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  async OnModuleInit() {
    await prisma.$connect();
  }

  async login(data) {
    const ticket = await client.verifyIdToken({
      idToken: data,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Destructuring the user info
    const { email, name, ...others } = ticket.getPayload();

    // Checking if user exists
    const exists_user = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });

    if (exists_user !== null) {
      return 'User Already exists';
    }

    // Saving user info in database
    const user = await prisma.admin.create({
      data: {
        email,
        name,
      },
    });

    return user;
  }
}
//
