function setupStartCommand(bot) {
  bot.command('start', async ctx => {
    ctx.reply('Per iniziare la procedura, aggiungi questo BOT ad un tuo gruppo telegram e invia il comando /config come admin');
  });
}

export default setupStartCommand;
