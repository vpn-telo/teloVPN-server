import { Api, Bot, RawApi } from 'grammy';
import { MyContext, MyConversation } from '../interfaces/common';
import { createConversation } from '@grammyjs/conversations';
import { addServer } from '../api/server';
import {
  getUser,
  getUserServer,
  removeUser,
  updateUser,
  updateUserPromocode,
  updateUserTest,
} from '../api/user';
import { getPrices } from '../api/price';
import { toHomeMenu } from '../keyboards/toHome.menu';
import { adminIds } from '../constants/common';
import { EUserRole } from '../enums/user.enum';
import { getExpirationTime } from '../functions/getExpirationTime';
import { addNewClient } from '../api/vpn/user';
import { getInbound } from '../api/vpn/getInbound';
import { getKey } from '../functions/getKey';
import { messages } from '../messages/common';
import { paymentSuccessMenu } from '../keyboards/paymentSuccess.menu';
import { generateVPNKeyHandler } from '../helpers/generateVPNKey';

export async function createServer(
  conversation: MyConversation,
  ctx: MyContext
) {
  await ctx.reply('Введи новый сервер в формате "name;url;max_user_count"');
  const { message } = await conversation.wait();
  const [server, url, max_users] = message.text?.split(';');

  try {
    const newServer = await addServer({ server, url, max_users });
    await ctx.reply(`Сервер успешно добавлен!`);
    await ctx.reply(JSON.stringify(newServer));
  } catch (e: any) {
    await ctx.reply(`Ошибка добавления сервера`);
    throw new Error(e);
  }

  return;
}

export async function removeUserFromServer(
  conversation: MyConversation,
  ctx: MyContext
) {
  await ctx.reply('Введи id пользователя в формате "userId: number"');
  const { message } = await conversation.wait();

  try {
    const user = await removeUser({ user_id: Number(message.text) });
    await ctx.reply(`Пользователь успешно удален!`);
    await ctx.reply(JSON.stringify(user));
  } catch (e: any) {
    await ctx.reply(`Ошибка удаления пользователя`);
    throw new Error(e);
  }

  return;
}

export async function getReview(conversation: MyConversation, ctx: MyContext) {
  await ctx.reply(
    'Напишите, пожалуйста, сообщением ниже ваш отзыв или пожелания и мы постараемся решить это в индивидуальном порядке :)'
  );
  const { message } = await conversation.wait();
  console.log(message);
  try {
    await ctx.api.sendMessage(
      adminIds[0],
      `Обратная связь от пользователя: ${JSON.stringify(message)}`
    );
    await ctx.reply(
      `Ваш отзыв успешно записан! Благодарим за уделенное время!`
    );
  } catch (e: any) {
    await ctx.reply(
      `Ошибка записи отзыва. Попробуйте, пожалуйста, позднее или напишите в поддержку.`
    );
    throw new Error(e);
  }

  return;
}

export async function addPromocode(
  conversation: MyConversation,
  ctx: MyContext
) {
  await ctx.reply('Введите, пожалуйста, промокод в сообщении ниже.');
  const { message } = await conversation.wait();

  try {
    const promocode = await getPrices({
      promocode: message.text?.toLowerCase()?.replace(/\s/g, ''),
    });

    if (promocode) {
      if (promocode.validity) {
        const currentUser = await getUser(ctx.from.id);
        
        if (currentUser.role === EUserRole.USER) {
          const currDate = new Date();
          currDate.setDate(currDate.getDate() + promocode.validity);
          const expiration_time = currDate.getTime();
          
          console.log(expiration_time)
          const user = await updateUserTest({
            user_id: ctx.from.id,
            expiration_time,
          });

          console.log(user)

          await addNewClient(user);
          await generateVPNKeyHandler({ ctx, user });
        }
      }

      await updateUserPromocode({
        user_id: ctx.from.id,
        promocode: promocode.promocode,
      });

      await ctx.reply(`Ваш промокод успешно применен!`, {
        reply_markup: toHomeMenu,
      });
    } else {
      await ctx.reply(`Указанного промокода не существует.`, {
        reply_markup: toHomeMenu,
      });
    }
  } catch (e: any) {
    await ctx.reply(
      `Ошибка применения промокода. Обратитесь, пожалуйста, в поддержку.`
    );
    throw new Error(e);
  }

  return;
}

export const createConversations = (bot: Bot<any, Api<RawApi>>) => {
  bot.use(createConversation(createServer));
  bot.use(createConversation(removeUserFromServer));
  bot.use(createConversation(getReview));
  bot.use(createConversation(addPromocode));
};
