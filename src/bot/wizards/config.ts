const WizardScene = require('telegraf/scenes/wizard');
import { getRepository } from 'typeorm';
import { Group } from '../../entity/Group';

const wizard = new WizardScene(
  'Configuration',
  async ctx => {
    let { id, title } = ctx.message.chat;
    id = String(id);
    const groupRepository = getRepository(Group);
    let currentGroup = await groupRepository.findOne(id);
    if (!currentGroup) {
      currentGroup = new Group();
      currentGroup.id = id;
      currentGroup.title = title;
      currentGroup.ref = '';
      currentGroup.isActive = true;
      groupRepository.save(currentGroup);
    }
    ctx.reply('Digita il tuo ref code');
    ctx.wizard.next();
  },
  async ctx => {
    if (ctx.message?.text) {
      const { text } = ctx.message;
      const { id } = ctx.message.chat;
      const groupRepository = getRepository(Group);
      const currentGroup = await groupRepository.findOne({
        where: { id },
      });
      if (text.startsWith('/')) {
        ctx.reply('Il testo inserito non è valido, ripetere');
        return;
      }
      if (!text.includes('-') || text.length < 4) {
        ctx.reply('Il testo inserito non è valido, ripetere');
        return;
      }
      currentGroup.ref = text.trim();
      groupRepository.save(currentGroup);
      ctx.reply('Ref code salvato correttamente per questo gruppo');
    }
    ctx.scene.leave();
  }
);

export default wizard;
