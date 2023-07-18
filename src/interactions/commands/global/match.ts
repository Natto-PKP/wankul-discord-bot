import type { ChatInput } from 'discord-sucrose';
import { langs } from '../../../translations/TranslationService';

export default <ChatInput>{
  permissions: { type: 'GUILD_ONLY' },

  cooldowns: {
    type: 'USER',
    label: 'global',
    value: 5,
  },

  body: {
    name: langs.en.match.body.name,
    nameLocalizations: { fr: langs.fr.match.body.name },
    description: langs.en.match.body.description,
    descriptionLocalizations: { fr: langs.fr.match.body.description },
  },
};
