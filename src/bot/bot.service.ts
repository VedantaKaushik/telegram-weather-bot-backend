import { Injectable, OnModuleInit } from '@nestjs/common';
import TelegramBot = require('node-telegram-bot-api');
import { City } from 'country-state-city';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const token = '6597989342:AAEGoxOKYfZ3U42fuldojSxKTvBxl03gSF0';

const bot = new TelegramBot(token, { polling: true });

// Checking City Function
const check_city = (cityName: string) => {
  const city_name = City.getAllCities().map((city) => city.name.toLowerCase());

  //   Checking if the city name is valid
  if (city_name.includes(cityName.toLowerCase())) {
    return cityName;
  } else {
    return 'Invalid City';
  }
};

Injectable();
export class BotService {
  async onModuleInit() {
    this.botStart();

    // Db Connection
    await prisma.$connect();

    // Running the function after every 1s
    setInterval(() => {
      this.sendUpdate();
    }, 1000);
  }

  // Getting user data and storing it in database
  botStart() {
    bot.on('message', async (msg) => {
      // Connecting to DB

      //Getting the required user info
      const userName = msg.from.username;
      const chatId = msg.chat.id;

      //   if the user typed /start
      if (msg.text === '/start') {
        const res = `Hello @${userName}. Please Start by typing Hi.`;
        return bot.sendMessage(chatId, res);
      }

      if (msg.text == 'hi' || msg.text == 'HI' || msg.text == 'Hi') {
        //   If user typed Hi
        const res = `Welcome @${userName} to the Weather Bot. You can subscribe to me to get daily weather update. Please type the name of your city.`;
        return bot.sendMessage(chatId, res);
      }

      const userCity = check_city(msg.text);
      if (userCity != 'Invalid City') {
        //   Getting city info
        const weather = await axios.post(
          `https://api.openweathermap.org/data/2.5/weather?q=${
            msg.text
          }&appid=${'42a5ea9c692cc64ab2951cb2617805f5'}&&units=metric`,
        );

        const temp = weather.data.main.temp;

        const res_weather = `It is currently ${Math.trunc(temp)}°C in ${
          weather.data.name
        }`;

        bot.sendMessage(chatId, res_weather);

        // Checking if user exists
        const user = await prisma.users.findUnique({
          where: {
            username: userName,
          },
        });
        if (user !== null) {
          return bot.sendMessage(chatId, 'You are already subscribed');
        }

        // If user does not exist them subscribing him
        const sub_res = 'You have also been successfully subscribed';

        setTimeout(() => {
          bot.sendMessage(chatId, sub_res);
        }, 2000);

        // Saving the user to DB
        await prisma.users.create({
          data: {
            username: userName,
            city: userCity,
            chatId,
          },
        });
      }
    });
  }

  //
  // Sending daily update to user on 8:30 am IST
  async sendUpdate() {
    // Getting the UTC time and converting it into string
    const UTCTime: string = new Date().toUTCString().slice(-12, -4);

    // Send update to user if he is subscribed
    const all_users = await prisma.users.findMany({
      where: {
        isSubscribed: true,
      },
    });

    if (UTCTime == '03:00:00') {
      // Fetching the subscribed user info from database and sending them alert
      for (let i = 0; i < all_users.length; i++) {
        const { city, chatId } = all_users[i];
        // Getting the users weather info
        const weather = await axios.post(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${'42a5ea9c692cc64ab2951cb2617805f5'}&&units=metric`,
        );
        const temp = weather.data.main.temp;
        const res_weather = `It is currently ${Math.trunc(temp)}°C in ${city}`;

        // Sending the message to the user
        bot.sendMessage(chatId, res_weather);
      }
    }
  }
}
