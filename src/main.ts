import { config } from 'dotenv';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
if (process.env.NODE_ENV === 'development') {
  config();
}

import App from './app';

const app = new App();
app.start();
