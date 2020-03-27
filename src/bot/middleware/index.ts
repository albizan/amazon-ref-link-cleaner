const Stage = require('telegraf/stage');
const session = require('telegraf/session');
import configWizard from '../wizards/config';
import guard from './guard';

function setupMiddleware(bot) {
  const stage = new Stage([configWizard]);
  console.log('MIDDLEWARE');

  console.log('Setup session...');
  bot.use(session());

  console.log('Setup scenes & wizards...');
  bot.use(stage.middleware());

  console.log('Setup guard middleware...');
  bot.use(guard);
}

export default setupMiddleware;
