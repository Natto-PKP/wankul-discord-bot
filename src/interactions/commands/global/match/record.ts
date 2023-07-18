import type { ChatInputSubOption } from 'discord-sucrose';
import { ApplicationCommandOptionType, ButtonStyle, ComponentType } from 'discord.js';
import TranslationService, { langs } from '../../../../translations/TranslationService';
import UserService from '../../../../services/UserService';
import StringUtil from '../../../../utils/StringUtil';
import { colors } from '../../../../config';
import MatchService from '../../../../services/MatchService';
import UserMatchService from '../../../../services/UserMatchService';
import { POINTS_PER_DRAW, POINTS_PER_WIN, POINTS_PER_LOSE } from '../../../../services/RankingService';
import database from '../../../../database';

export default <ChatInputSubOption>{
  permissions: { type: 'GUILD_ONLY' },

  cooldowns: [{
    label: 'match',
    type: 'USER',
    value: 24 * 60 * 60 * 1000,
    stack: 15,
  }],

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
        name: langs.en.match.record.body.options.state.name,
        nameLocalizations: { fr: langs.fr.match.record.body.options.state.name },
        description: langs.en.match.record.body.options.state.description,
        descriptionLocalizations: { fr: langs.fr.match.record.body.options.state.description },
        choices: [
          {
            name: langs.en.match.record.body.options.state.choices.win,
            nameLocalizations: { fr: langs.fr.match.record.body.options.state.choices.win },
            value: 'win',
          },
          {
            name: langs.en.match.record.body.options.state.choices.loose,
            nameLocalizations: { fr: langs.fr.match.record.body.options.state.choices.loose },
            value: 'loose',
          },
          {
            name: langs.en.match.record.body.options.state.choices.draw,
            nameLocalizations: { fr: langs.fr.match.record.body.options.state.choices.draw },
            value: 'draw',
          },
        ],
        required: true,
        type: ApplicationCommandOptionType.String,
      },
      {
        name: langs.en.match.record.body.options.challenger.name,
        nameLocalizations: { fr: langs.fr.match.record.body.options.challenger.name },
        description: langs.en.match.record.body.options.challenger.description,
        descriptionLocalizations: {
          fr: langs.fr.match.record.body.options.challenger.description,
        },
        required: false,
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
    // # Get variables
    const challenger = interaction.options.getUser(
      langs.en.match.record.body.options.challenger.name,
    ) || interaction.user;

    const opponent = interaction.options.getUser(
      langs.en.match.record.body.options.player.name,
      true,
    );

    const state = interaction.options.getString(
      langs.en.match.record.body.options.state.name,
      true,
    );

    const isCompetitive = interaction.options.getBoolean(
      langs.en.match.record.body.options.competitive.name,
    ) || false;

    // # Get translation
    const translation = TranslationService.get(interaction.locale);

    // # Check if the match is valid
    if (challenger.id === opponent.id) {
      throw new Error(translation.match.record.cantRecordYourself);
    }

    // # Check if the players are registered
    const challengerUser = await UserService.getByDiscordId(challenger.id);
    if (!challengerUser) throw new Error(translation.match.record.userNotRegistered);
    const opponentUser = await UserService.getByDiscordId(opponent.id);
    if (!opponentUser) throw new Error(translation.match.record.playerNotRegistered);

    const bothNeedToAccept = challenger.id !== interaction.user.id;

    // # Setup verification message
    const title = translation.match.record.verification[isCompetitive ? 'competitiveTitle' : 'title'];
    const content = StringUtil.handleVariables(translation.match.record.content, {
      player: challenger,
      user: opponent,
    });
    const description = StringUtil.handleVariables(
      translation.match.record.verification.descriptions[state as 'win' | 'loose' | 'draw'],
      { challenger, opponent },
    );
    const footer = bothNeedToAccept
      ? translation.match.record.verification.footer.both
      : translation.match.record.verification.footer.single;

    // # Send verification message
    const verificationMessage = await interaction.reply({
      content,
      embeds: [{
        title,
        color: colors.blue,
        description,
        footer: { text: footer },
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

    const alreadyInteracted = [] as string[];

    // # Create a collector to check if the looser confirms the match
    const collector = verificationMessage.createMessageComponentCollector({
      filter: (int) => {
        if (alreadyInteracted.includes(int.user.id)) return false;
        alreadyInteracted.push(int.user.id);
        return bothNeedToAccept
          ? int.user.id === opponent.id || int.user.id === challenger.id
          : int.user.id === opponent.id;
      },
      time: 60000,
      max: bothNeedToAccept ? 2 : 1,
    });

    // # Handle the collector
    collector.on('collect', async (int) => {
      int.deferUpdate();
    });

    collector.on('end', async (collected, reason) => {
      if (reason === 'max') {
        const everyoneAccepted = collected.every((int) => {
          const r = int.customId === langs.en.match.record.verification.components.yes;
          return r;
        });

        // # If everyone accepted, create the match
        if (everyoneAccepted) {
          const transaction = await database.transaction();

          try {
            // # Create the match
            const match = await MatchService.create({ isCompetitive, isDraw: state === 'draw' }, { transaction });

            // # Add the users to the match
            await UserMatchService.add(challengerUser.id, match.id, {
              isWinner: state === 'win',
              isDraw: state === 'draw',
              opponentId: opponentUser.id,
            }, { transaction });

            await UserMatchService.add(opponentUser.id, match.id, {
              isWinner: state === 'loose',
              isDraw: state === 'draw',
              opponentId: challengerUser.id,
            }, { transaction });

            // # If the match is competitive, update the users' points
            if (isCompetitive) {
              if (state === 'draw') {
                await UserService.addDraw(challengerUser.id, { transaction });
                await UserService.addPoints(challengerUser.id, POINTS_PER_DRAW, { transaction });
                await UserService.addDraw(opponentUser.id, { transaction });
                await UserService.addPoints(opponentUser.id, POINTS_PER_DRAW, { transaction });
              } else if (state === 'win') {
                await UserService.addVictory(challengerUser.id, { transaction });
                await UserService.addPoints(challengerUser.id, POINTS_PER_WIN, { transaction });
                await UserService.addDefeat(opponentUser.id, { transaction });
                await UserService.addPoints(opponentUser.id, POINTS_PER_LOSE, { transaction });
              } else if (state === 'loose') {
                await UserService.addDefeat(challengerUser.id, { transaction });
                await UserService.addPoints(challengerUser.id, POINTS_PER_LOSE, { transaction });
                await UserService.addVictory(opponentUser.id, { transaction });
                await UserService.addPoints(opponentUser.id, POINTS_PER_WIN, { transaction });
              }
            }

            await transaction.commit();
          } catch (err) {
            await transaction.rollback();
            throw err;
          }
        }

        await verificationMessage.edit({
          content,
          embeds: [{
            title,
            color: everyoneAccepted ? colors.green : colors.red,
            description: everyoneAccepted
              ? translation.match.record.registered
              : translation.match.record.notRegistered,
          }],
          components: [],
        });
      } else if (reason === 'time') {
        await verificationMessage.edit({
          content,
          embeds: [{ title, color: colors.red, description: translation.match.record.timeout }],
          components: [],
        });
      } else {
        await verificationMessage.edit({
          content,
          embeds: [{ title, color: colors.red, description }],
          components: [],
        });
      }
    });
  },
};
