import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';

import type { ChatInputSubOption } from 'discord-sucrose';
import {
  ApplicationCommandOptionType, ButtonStyle, ComponentType, InteractionReplyOptions,
} from 'discord.js';

import UserService from '../../../../services/UserService';
import UserMatchService from '../../../../services/UserMatchService';
import { MatchModel, UserModel } from '../../../../models';
import TranslationService, { langs } from '../../../../translations/TranslationService';
import StringUtil from '../../../../utils/StringUtil';
import { colors } from '../../../../config';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const MATCHES_PER_PAGE = 10;

export default <ChatInputSubOption>{
  body: {
    name: langs.en.match.history.body.name,
    nameLocalizations: { fr: langs.fr.match.history.body.name },
    type: ApplicationCommandOptionType.Subcommand,
    description: langs.en.match.history.body.description,
    descriptionLocalizations: { fr: langs.fr.match.history.body.description },
    options: [
      {
        name: langs.en.match.history.body.options.player.name,
        nameLocalizations: { fr: langs.fr.match.history.body.options.player.name },
        description: langs.en.match.history.body.options.player.description,
        descriptionLocalizations: { fr: langs.fr.match.history.body.options.player.description },
        required: false,
        type: ApplicationCommandOptionType.User,
      },
    ],
  },

  exec: async ({ interaction, sucrose }) => {
    // # Get user
    const discordPlayer = interaction.options.getUser(
      langs.en.match.history.body.options.player.name,
    ) ?? interaction.user;

    // # Get player
    const player = await UserService.getByDiscordId(discordPlayer.id);

    // # Get translation
    const translation = TranslationService.get(interaction.locale);

    // # Check if player exists
    if (!player) throw new Error(translation.match.history.playerNotRegistered);

    // # Create interaction reply
    const createInteractionReply = async (page = 0) => {
      const matches = await UserMatchService.getAllByUserId(player.id, {
        limit: MATCHES_PER_PAGE,
        page,
        getNextRow: true,
      }, [{ model: UserModel, as: 'opponent' }, { model: MatchModel, as: 'match' }]);

      const hasNextPage = matches.length > MATCHES_PER_PAGE;
      if (hasNextPage) matches.pop();

      let positionPad = 0;

      // # Create list
      const list = await Promise.all(matches.map(async (match, i) => {
        const discordOpponent = await sucrose.users.fetch(match.opponent.discordId);

        const position = `${i + 1 + page * MATCHES_PER_PAGE}.`;
        if (positionPad === 0) positionPad = position.length + 1;

        return StringUtil.handleVariables(translation.match.history.list.row, {
          i: position.padEnd(positionPad, ' '),
          competitive: match.match.isCompetitive ? ' 🏆' : '',
          statut: (match.isWinner
            ? `✅ ${translation.match.history.list.victory}`
            : `❌ ${translation.match.history.list.defeat}`
          ).toUpperCase(),
          opponent: discordOpponent.username || match.opponent.discordId,
          date: dayjs.duration(
            dayjs(match.match.createdAt).diff(dayjs()),
          ).locale(interaction.locale).humanize(true),
        });
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
          ...(list.length ? {
            description: `📊 **${StringUtil.handleVariables(translation.match.history.list.description, {
              player: discordPlayer,
            })}**\n\n${list.join('\n')}`,
            footer: {
              text: StringUtil.handleVariables(translation.match.history.list.footer, {
                page: page + 1,
              }),
            },
          } : {
            description: translation.match.history.list.empty,
          }),
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
