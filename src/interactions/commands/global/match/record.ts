import type { ChatInputSubOption } from 'discord-sucrose';
import { ApplicationCommandOptionType, ButtonStyle, ComponentType } from 'discord.js';
import UserService from '../../../../services/UserService';
import MatchService from '../../../../services/MatchService';
import UserMatchService from '../../../../services/UserMatchService';
import TranslationService, { langs } from '../../../../translations/TranslationService';
import StringUtil from '../../../../utils/StringUtil';

export default <ChatInputSubOption>{
  // cooldowns: {
  //   label: 'match',
  //   type: 'USER',
  //   value: 5 * 60000,
  // },

  body: {
    name: langs.en.match.record.body.name,
    nameLocalizations: { fr: langs.fr.match.record.body.name },
    type: ApplicationCommandOptionType.Subcommand,
    description: langs.en.match.record.body.description,
    descriptionLocalizations: { fr: langs.fr.match.record.body.description },
    options: [
      {
        name: langs.en.match.record.body.options.player.name,
        nameLocalizations: { fr: langs.fr.match.record.body.options.player.name },
        description: langs.en.match.record.body.options.player.description,
        descriptionLocalizations: { fr: langs.fr.match.record.body.options.player.description },
        required: true,
        type: ApplicationCommandOptionType.User,
      },
      {
        name: langs.en.match.record.body.options.winner.name,
        nameLocalizations: { fr: langs.fr.match.record.body.options.winner.name },
        description: langs.en.match.record.body.options.winner.description,
        descriptionLocalizations: { fr: langs.fr.match.record.body.options.winner.description },
        required: true,
        type: ApplicationCommandOptionType.User,
      },
      {
        name: langs.en.match.record.body.options.competitive.name,
        nameLocalizations: { fr: langs.fr.match.record.body.options.competitive.name },
        description: langs.en.match.record.body.options.competitive.description,
        descriptionLocalizations: {
          fr: langs.fr.match.record.body.options.competitive.description,
        },
        required: false,
        type: ApplicationCommandOptionType.Boolean,
      },
    ],
  },

  exec: async ({ interaction }) => {
    // # Get user
    const discordUser = interaction.user;

    // # Get players
    const discordPlayer = interaction.options.getUser(
      langs.en.match.record.body.options.player.name,
      true,
    );

    // # Get winner
    const discordWinner = interaction.options.getUser(
      langs.en.match.record.body.options.winner.name,
      true,
    );

    // # Get competitive
    const isCompetitive = interaction.options.getBoolean(
      langs.en.match.record.body.options.competitive.name,
    ) || false;

    // # Get translation
    const translation = TranslationService.get(interaction.locale);

    // # Check if the match is valid
    if (discordPlayer.id === discordUser.id) {
      throw new Error(translation.match.record.cantRecordYourself);
    }

    if (![discordPlayer.id, discordUser.id].includes(discordWinner.id)) {
      throw new Error(translation.match.record.winnerNotInMatch);
    }

    // # Check if the players are registered
    const player = await UserService.getByDiscordId(discordPlayer.id);
    if (!player) throw new Error(translation.match.record.playerNotRegistered);
    const user = await UserService.getByDiscordId(discordUser.id);
    if (!user) throw new Error(translation.match.record.userNotRegistered);

    const winner = discordPlayer.id === discordWinner.id ? player : user;
    const looser = discordPlayer.id === discordWinner.id ? user : player;

    // # Check if the match is valid
    const checkMessage = await interaction.reply({
      content: StringUtil.handleVariables(translation.match.record.content, {
        player: discordPlayer,
        user: discordUser,
      }),
      embeds: [{
        title: translation.match.record.verification.title,
        description: StringUtil.handleVariables(
          translation.match.record.verification.description,
          { winner: winner.discordId, looser: looser.discordId },
        ),
      }],
      components: [{
        type: ComponentType.ActionRow,
        components: [
          {
            customId: 'yes',
            type: ComponentType.Button,
            label: translation.match.record.verification.components.yes,
            style: ButtonStyle.Success,
            emoji: '✅',
          },
          {
            customId: 'no',
            type: ComponentType.Button,
            label: translation.match.record.verification.components.no,
            style: ButtonStyle.Danger,
            emoji: '❌',
          },
        ],
      }],
      fetchReply: true,
    });

    // # Create a collector to check if the looser confirms the match
    const collector = checkMessage.createMessageComponentCollector({
      filter: (int) => int.user.id === looser.discordId,
      time: 60000,
      max: 1,
    });

    collector.on('collect', async (component) => {
      if (['yes', 'no'].includes(component.customId)) {
        await checkMessage.edit({
          content: StringUtil.handleVariables(translation.match.record.content, {
            player: discordPlayer,
            user: discordUser,
          }),
          embeds: [{
            title: translation.match.record.verification.title,
            description: component.customId === 'yes'
              ? translation.match.record.success
              : translation.match.record.failed,
          }],
          components: [],
        });
      }

      // # If the looser doesn't confirm the match
      if (component.customId === 'no') {
        await component.reply({
          content: translation.match.record.failed,
          ephemeral: true,
        });

        // # If the looser confirms the match
      } else if (component.customId === 'yes') {
        try {
          const match = await MatchService.create({ isCompetitive, isFinished: true });

          await UserMatchService.add(winner.id, match.id, {
            isWinner: true,
            opponentId: looser.id,
          });

          await UserMatchService.add(looser.id, match.id, {
            isWinner: false,
            opponentId: winner.id,
          });

          await component.reply({
            content: StringUtil.handleVariables(
              translation.match.record.success,
              { matchId: match.id },
            ),
            ephemeral: true,
          });
        } catch (err) {
          await component.reply({ content: translation.match.record.error, ephemeral: true });
        }
      }
    });

    collector.on('end', async (_collected, reason) => {
      // # If the collector ended because of a timeout
      if (reason === 'time') {
        await checkMessage.edit({
          content: StringUtil.handleVariables(translation.match.record.content, { player, user }),
          embeds: [{
            title: translation.match.record.verification.title,
            description: StringUtil.handleVariables(
              translation.match.record.verification.description,
              { winner: winner.discordId, looser: looser.discordId },
            ),
          }],
          components: [],
        });
      }
    });
  },
};
