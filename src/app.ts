import 'reflect-metadata';
import { createConnection } from 'typeorm';
import bot from './bot';

export default class App {
  async start() {
    try {
      await createConnection({
        type: 'postgres',
        url: process.env.DB_URL,
        synchronize: true,
        logging: false,
        entities: ['./entity/*{.ts,.js}'],
      });

      bot.launch();
    } catch (error) {
      console.log(error);
    }
  }
}
