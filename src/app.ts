import 'reflect-metadata';
import { createConnection } from 'typeorm';
import bot from './bot';

export default class App {
  async start() {
    try {
      await createConnection();

      bot.launch();
    } catch (error) {
      console.log(error);
    }
  }
}
