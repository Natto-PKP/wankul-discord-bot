import type { ChatInput } from 'discord-sucrose';
import { ApplicationCommandOptionType, type GuildMember } from 'discord.js';
import { createCanvas, loadImage } from 'canvas';
import UserService from '../../../services/UserService';
import CanvasUtil from '../../../utils/CanvasUtil';
import TranslationService, { langs } from '../../../translations/TranslationService';

export default <ChatInput>{
  cooldowns: {
    type: 'USER',
    label: 'global',
    value: 5,
  },

  body: {
    name: langs.en.profile.body.name,
    nameLocalizations: { fr: langs.fr.profile.body.name },
    description: langs.en.profile.body.description,
    descriptionLocalizations: { fr: langs.fr.profile.body.description },
    options: [
      {
        name: langs.en.profile.body.options.user.name,
        nameLocalizations: { fr: langs.fr.profile.body.options.user.name },
        description: langs.en.profile.body.options.user.description,
        descriptionLocalizations: { fr: langs.fr.profile.body.options.user.description },
        type: ApplicationCommandOptionType.User,
        required: false,
      },
    ],
  },

  async exec({ interaction }) {
    // # Get the translation
    const translation = TranslationService.get(interaction.locale);

    // # Get the user
    const discordUser = interaction.options.getUser(
      langs.en.profile.body.options.user.name,
    ) || interaction.user;

    // # Get the user from the database
    const user = await UserService.getByDiscordId(discordUser.id);
    if (!user) throw new Error(translation.profile.notRegistered);
    const member = interaction.member as GuildMember | undefined;

    // # Create the canvas
    const canvas = createCanvas(1070, 320);
    const ctx = canvas.getContext('2d');
    const background = await loadImage('./resources/images/profile/fondbleu-profile.png');
    const avatar = await loadImage(interaction.user.displayAvatarURL({ size: 512 }));

    CanvasUtil.rect(ctx, 0, 0, canvas.width, canvas.height, 4);
    ctx.clip();
    ctx.save();

    /* Background */
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    /* Avatar */
    ctx.beginPath();
    ctx.fillStyle = '#141414';
    CanvasUtil.rect(ctx, 786, 36, 248, 248, 8);
    ctx.fill();
    CanvasUtil.rect(ctx, 790, 40, 240, 240, 8);
    ctx.clip();
    ctx.drawImage(avatar, 790, 40, 240, 240);
    ctx.restore();
    ctx.closePath();

    /* Username */
    ctx.beginPath();
    ctx.font = `bold 48px "${CanvasUtil.CONTENT_FONT_BOLD}, ${CanvasUtil.CONTENT_FONT}"`;
    let username = member?.displayName || interaction.user.username;
    while (ctx.measureText(username).width > 650) {
      username = username.slice(0, username.length - 2);
    }
    ctx.fillStyle = '#f1c40f';
    ctx.fillText(`${username}`, 40, 80);
    ctx.closePath();

    // # Send the image
    await interaction.reply({
      files: [{ attachment: canvas.toBuffer(), name: 'profile.png' }],
    });
  },
};
