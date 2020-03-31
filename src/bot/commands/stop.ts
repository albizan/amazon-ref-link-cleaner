import { getRepository } from 'typeorm';
import { Group } from '../../entity/Group';

function setupStopCommand(bot) {
  bot.command('stop', async ctx => {
    let { id, title } = ctx.message.chat;
    const groupRepository = getRepository(Group);
    let currentGroup = await groupRepository.findOne(id);
    if (!currentGroup) {
      currentGroup = new Group();
      currentGroup.id = id;
      currentGroup.title = title;
      currentGroup.ref = '';
      currentGroup.isActive = false;
      groupRepository.save(currentGroup);
      ctx.reply('Bot spento');
      return;
    }
    if (currentGroup.isActive) {
      currentGroup.isActive = false;
      groupRepository.save(currentGroup);
      ctx.reply('Bot spento');
      return;
    }
  });
}

export default setupStopCommand;
