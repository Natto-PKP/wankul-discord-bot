import type { SelectMenu } from 'discord-sucrose';
import { ComponentType } from 'discord.js';

export default <SelectMenu>{
  body: {
    type: ComponentType.StringSelect,
    customId: 'select-me',
    placeholder: 'Select me !',
    options: [
      { label: 'I love ferret !', value: 'ferret' },
      { label: 'I love ferret !', value: 'ferret' },
      { label: 'I love ferret !', value: 'ferret' },
      { label: 'I love ferret !', value: 'ferret' },
      { label: 'I love ferret !', value: 'ferret' },
    ],
  },

  exec: async ({ interaction }) => {
    await interaction.reply('I LOVE FERRET !!!');
  },
};
