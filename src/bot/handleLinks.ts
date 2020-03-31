import { getRepository } from 'typeorm';
import { Group } from '../entity/Group';
const Markup = require('telegraf/markup');
const axios = require('axios');
import UrlObject from './url.interface';
import shortner from '../shortner';

export async function handleTextSubType(ctx) {
  let { entities, text } = ctx.message;
  if (!entities) {
    return;
  }

  let urls = extractUrlsFromText(entities, text);
  if (urls.length <= 0) {
    return;
  }

  const groupRepository = getRepository(Group);
  const currentGroup = await groupRepository.findOne(ctx.message.chat?.id);
  if (!currentGroup) {
    return;
  }
  if (!currentGroup.isActive) {
    return;
  }
  if (currentGroup.isBanned) {
    return;
  }

  const urlObjects: Array<UrlObject> = await generateUrlObjects(urls, currentGroup.ref);
  let { cartUrl, cartItems } = createCartUrl(urlObjects, currentGroup.ref);
  const messageText = createMessageText(ctx.from.username, text, urlObjects);

  // Delete original message and send new message with replaced links
  // if cartItems > 0 means that there is at least one amazon product in th urlObjects array, if so send message with 'Add to Cart' button
  ctx.deleteMessage();
  if (cartItems > 0) {
    ctx.reply(messageText, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.urlButton('Aggiungi al carrello', cartUrl)]]) });
  } else {
    ctx.reply(messageText, { parse_mode: 'HTML' });
  }
}

export async function handleImageSubType(ctx) {
  const { caption, caption_entities, photo } = ctx.message;
  const photoFileId = photo[0].file_id;
  if (!caption_entities) {
    return;
  }

  let urls = extractUrlsFromText(caption_entities, caption);
  if (urls.length <= 0) {
    return;
  }

  const groupRepository = getRepository(Group);
  const currentGroup = await groupRepository.findOne(ctx.message.chat?.id);
  if (!currentGroup) {
    return;
  }
  if (currentGroup.isBanned) {
    return;
  }

  const urlObjects: Array<UrlObject> = await generateUrlObjects(urls, currentGroup.ref);
  const messageText = createMessageText(ctx.from.username, caption, urlObjects);
  ctx.deleteMessage();
  ctx.replyWithPhoto(photoFileId, {
    caption: messageText,
    parse_mode: 'HTML',
  });
}

function extractUrlsFromText(entities, text): Array<string> {
  const urlEntities = entities.filter(e => e.type === 'url');
  return urlEntities.map(e => text.slice(e.offset, e.offset + e.length));
}

async function generateUrlObjects(urls: Array<string>, ref: string): Promise<Array<UrlObject>> {
  const urlObjects = urls.map(async url => {
    let trueUrl = url;
    if (url.includes('amzn.to') || url.includes('voob.it')) {
      try {
        const response = await axios.get(url, {
          validateStatus: function(status) {
            return status == 301;
          },
          maxRedirects: 0,
        });
        trueUrl = response.headers.location;
      } catch (error) {
        console.log(error);
        return;
      }
    }

    if (trueUrl.includes('amazon')) {
      // Clean url from queries and refs
      let baseUrl = trueUrl.split('?')[0].split('/ref=')[0];

      // When url is cleaned, ASIN is the latest element of the url string
      const splittedUrl = baseUrl.split('/');
      const asin = splittedUrl.slice(-1)[0];
      const reffed = baseUrl + `?tag=${ref}`;
      const response = await shortner.post('', {
        destination: reffed,
        domain: { fullName: 'rebrand.ly' },
      });
      const urlObject: UrlObject = {
        domain: getDomain(trueUrl),
        original: url,
        short: response.data.shortUrl,
        asin: asin,
      };
      return urlObject;
    } else {
      // Not an amazon link
      try {
        let secureUrl = url;
        if (!url.startsWith('https://')) {
          secureUrl = `https://${url}`;
        }
        const response = await shortner.post('', {
          destination: secureUrl,
          domain: { fullName: 'rebrand.ly' },
        });
        const urlObject: UrlObject = {
          domain: getDomain(trueUrl),
          original: url,
          short: response.data.shortUrl,
        };
        return urlObject;
      } catch (error) {
        console.log(error);
      }
    }
  });

  return Promise.all(urlObjects);
}

function createCartUrl(urlObjects: Array<UrlObject>, ref: string) {
  let cartUrl = 'https://www.amazon.it/gp/aws/cart/add-res.html?';
  let cartItems = 0;
  urlObjects.forEach(({ asin }, i) => {
    if (asin) {
      cartItems++;
      cartUrl += `ASIN.${i + 1}=${asin}&Quantity.${i + 1}=1&`;
    }
  });
  cartUrl += `tag=${ref}&AssociateTag=${ref}`;
  return { cartUrl, cartItems };
}

function replaceLinks(text: string, urlObjects: Array<UrlObject>) {
  let message = text;
  urlObjects.forEach(urlObj => {
    message = message.replace(urlObj.original, `<b><a href="${urlObj.short}"> Vedi su ${urlObj.domain}</a></b>`);
  });

  return message;
}

function createMessageText(username: string, text: string, urlObjects: Array<UrlObject>) {
  let message = replaceLinks(text, urlObjects);
  return `<b>Messaggio inviato da</b> <em>@${username}</em>\n\n${message}`;
}

function getDomain(url) {
  let result;
  let match;
  if ((match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im))) {
    result = match[1];
    if ((match = result.match(/^[^\.]+\.(.+\..+)$/))) {
      result = match[1];
    }
  }
  return result;
}
