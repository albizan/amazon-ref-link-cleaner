function setupStartCommand(bot) {
  bot.command('start', async ctx => {
    ctx.reply(
      'Aggiungi questo BOT ad un gruppo e lancia il comando /launch per avviarlo oppure /stop fer spegnerlo.\nUsare il comando /config per impostare un tag referral di amazon'
    );
  });
}

export default setupStartCommand;
