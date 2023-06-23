import type { EventModule } from 'discord-sucrose';
import { ChannelType, TextChannel } from 'discord.js';

export default <EventModule<'guildMemberAdd'>>{
  label: 'send-message',

  exec: async ({ args: [member] }) => {
    const channels = member.guild.channels.cache.filter((ch) => ch.type === ChannelType.GuildText);
    const channel = channels.random() as TextChannel;
    if (channel) channel.send(`${member.displayName} entered a`);
  },
};
