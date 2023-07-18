import type { ChatInputSubOption } from 'discord-sucrose';
import {
  ApplicationCommandOptionType, ButtonStyle, ComponentType, InteractionReplyOptions,
} from 'discord.js';
import { Op } from 'sequelize';
import UserService from '../../../../services/UserService';
import TranslationService, { langs } from '../../../../translations/TranslationService';
import { colors } from '../../../../config';

const USERS_PER_PAGE = 10;

export default <ChatInputSubOption>{
  permissions: { type: 'GUILD_ONLY' },

  body: {
    name: langs.en.match.scoreboard.body.name,
    nameLocalizations: { fr: langs.fr.match.scoreboard.body.name },
    description: langs.en.match.scoreboard.body.description,
    descriptionLocalizations: { fr: langs.fr.match.scoreboard.body.description },
    options: [
      {
        name: langs.en.match.scoreboard.body.options.global.name,
        nameLocalizations: { fr: langs.fr.match.scoreboard.body.options.global.name },
        description: langs.en.match.scoreboard.body.options.global.description,
        descriptionLocalizations: { fr: langs.fr.match.scoreboard.body.options.global.description },
        type: ApplicationCommandOptionType.Boolean,
      },
    ],
  },

  exec: async ({ interaction, sucrose }) => {
    const global = interaction.options.getBoolean('global') ?? false;
    const where = global
      ? { }
      : { [Op.in]: interaction.guild?.members.cache.map((member) => member.id) };
    const translation = TranslationService.get(interaction.locale);
    const user = await UserService.getByDiscordId(interaction.user.id);

    const createInteractionReply = async (page = 0) => {
      const scoreboard = await UserService.getAll({ ...where, rating: { [Op.gt]: 0 } }, {
        limit: USERS_PER_PAGE,
        page,
        getNextRow: true,
      }, { order: [['rating', 'DESC']] });

      const hasNextPage = scoreboard.length > USERS_PER_PAGE;
      if (hasNextPage) scoreboard.pop();

      const selfPosition = user && await UserService.getPositionByRating(user.rating);

      // # Create list
      const list = await Promise.all(scoreboard.map(async (top, i) => {
        const position = i + 1 + page * USERS_PER_PAGE;
        const discordUser = await sucrose.users.fetch(top.discordId);
        const username = discordUser.username || 'Unknown';
        return `\`${position}. \` **${username}** - ${top.rating} ${selfPosition === position ? '👈' : ''}`;
      }));

      const components = [];

      // # Prev page button
      if (page > 0) {
        components.push({
          type: ComponentType.Button,
          label: translation.match.history.list.components.previous,
          style: ButtonStyle.Primary,
          emoji: '⬅️',
          custom_id: 'previous-page',
        });
      }

      // # Close button
      if (page > 0 || hasNextPage) {
        components.push({
          type: ComponentType.Button,
          // label: translation.match.history.list.components.close,
          style: ButtonStyle.Secondary,
          emoji: '❌',
          custom_id: 'close',
        });
      }

      // # Next page button
      if (hasNextPage) {
        components.push({
          type: ComponentType.Button,
          label: translation.match.history.list.components.next,
          style: ButtonStyle.Primary,
          emoji: '➡️',
          custom_id: 'next-page',
        });
      }

      return {
        embeds: [{
          color: colors.yellow,
          description: list.join('\n'),
        }],
        components: components.length ? [{ type: ComponentType.ActionRow, components }] : [],
      } as InteractionReplyOptions;
    };

    let currentPage = 0;
    const newInteraction = await interaction.reply(await createInteractionReply());

    const collector = newInteraction.createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      idle: 60000,
    });

    // # Handle interaction
    collector.on('collect', async (i) => {
      if (i.customId === 'close') {
        i.deferUpdate();
        collector.stop();
      } else if (i.customId === 'previous-page') {
        currentPage -= 1;
        i.deferUpdate();
        await interaction.editReply(await createInteractionReply(currentPage));
      } else if (i.customId === 'next-page') {
        currentPage += 1;
        i.deferUpdate();
        await interaction.editReply(await createInteractionReply(currentPage));
      }
    });

    // # Remove components on end
    collector.on('end', async () => {
      await interaction.editReply({ components: [] });
    });

    // # Handle error
    collector.on('error', async (err) => {
      throw err;
    });
  },
};
