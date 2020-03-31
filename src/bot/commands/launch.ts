import { getRepository } from 'typeorm';
import { Group } from '../../entity/Group';

function setupLaunchCommand(bot) {
  bot.command('launch', async ctx => {
    let { id, title } = ctx.message.chat;
    console.log(id);
    const groupRepository = getRepository(Group);
    let currentGroup = await groupRepository.findOne(id);
    console.log(currentGroup);
    if (!currentGroup) {
      currentGroup = new Group();
      currentGroup.id = id;
      currentGroup.title = title;
      currentGroup.ref = '';
      currentGroup.isActive = true;
      groupRepository.save(currentGroup);
      ctx.reply('Bot avviato');
      return;
    }
    if (!currentGroup.isActive) {
      currentGroup.isActive = true;
      groupRepository.save(currentGroup);
      ctx.reply('Bot avviato');
      return;
    }
  });
}

export default setupLaunchCommand;
