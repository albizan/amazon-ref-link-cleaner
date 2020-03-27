import Telegraf from 'telegraf';
import { handleTextSubType, handleImageSubType } from './handleLinks';

import setupCommands from './commands';
import setupMiddleware from './middleware';

// Create BOT instance
const bot = new Telegraf(process.env.BOT_TOKEN);

setupMiddleware(bot);
setupCommands(bot);

bot.on('message', async ctx => {
  const [updateSubType] = ctx.updateSubTypes;
  switch (updateSubType) {
    case 'text':
      handleTextSubType(ctx);
      break;
    case 'photo':
      handleImageSubType(ctx);
      break;
  }
});

export default bot;
