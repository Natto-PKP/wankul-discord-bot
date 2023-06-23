import { ComponentType, TextInputStyle } from 'discord.js';
import type { Form } from 'discord-sucrose';

export default <Form>{
  body: {
    customId: 'create-report',
    title: 'Report ticket',
    components: [
      {
        type: ComponentType.ActionRow,
        components: [
          {
            customId: 'report-reason',
            type: ComponentType.TextInput,
            style: TextInputStyle.Short,
            label: 'Indicate the reason for the report',
            required: true,
          },
        ],
      },
      {
        type: ComponentType.ActionRow,
        components: [
          {
            customId: 'report-args',
            type: ComponentType.TextInput,
            style: TextInputStyle.Paragraph,
            label: 'Indicate your problem',
            required: true,
          },
        ],
      },
    ],
  },

  exec: async ({ interaction }) => {
    const reason = interaction.fields.getTextInputValue('report-reason');
    const args = interaction.fields.getTextInputValue('report-args');

    await interaction.reply(`Someone sent a report: ${reason}\n\`\`\`${args}\`\`\``);
  },
};
