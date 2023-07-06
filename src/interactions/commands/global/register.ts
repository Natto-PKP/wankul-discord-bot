import type { ChatInput } from 'discord-sucrose';
import UserService from '../../../services/UserService';
import TranslationService, { langs } from '../../../translations/TranslationService';

export default <ChatInput>{
  cooldowns: {
    type: 'USER',
    label: 'global',
    value: 5,
  },

  body: {
    name: langs.en.register.body.name,
    nameLocalizations: { fr: langs.fr.register.body.name },
    description: langs.en.register.body.description,
    descriptionLocalizations: { fr: langs.fr.register.body.description },
  },

  async exec({ interaction }) {
    const translation = TranslationService.get(interaction.locale);
    const user = await UserService.getByDiscordId(interaction.user.id);
    if (user) throw new Error(translation.register.alreadyRegistered);

    await UserService.create({ discordId: interaction.user.id });
    await interaction.reply({ content: translation.register.success });
  },
};
