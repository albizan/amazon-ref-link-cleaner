function setupConfigCommand(bot) {
  bot.command('config', ctx => {
    console.log('Entering Configuration Wizard');
    ctx.scene.enter('Configuration');
  });
}

export default setupConfigCommand;
