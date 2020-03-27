import setupStartCommand from './start';
import setupConfigCommand from './config';

function setupCommands(bot) {
  console.log('COMMANDS');

  console.log('Setup start command...');
  setupStartCommand(bot);

  console.log('Setup config command...');
  setupConfigCommand(bot);
}

export default setupCommands;
