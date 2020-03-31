import setupStartCommand from './start';
import setupConfigCommand from './config';
import setupLaunchCommand from './launch';
import setupStopCommand from './stop';

function setupCommands(bot) {
  console.log('COMMANDS');

  console.log('Setup start command...');
  setupStartCommand(bot);

  console.log('Setup config command...');
  setupConfigCommand(bot);

  console.log('Setup launch command...');
  setupLaunchCommand(bot);

  console.log('Setup stop command...');
  setupStopCommand(bot);
}

export default setupCommands;
