import { ButtonStyle, ComponentType } from 'discord.js';
import type { Button } from 'discord-sucrose';

export default <Button>{
  body: {
    customId: 'use-me',
    type: ComponentType.Button,
    style: ButtonStyle.Primary,
    label: 'use me',
  },

  exec: async ({ interaction }) => {
    await interaction.reply('Yeeaaaaah !');
  },
};
