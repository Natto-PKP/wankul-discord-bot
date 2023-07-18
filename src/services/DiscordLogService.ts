import type { TextChannel } from 'discord.js';
import sucrose from '..';
import { channels, colors } from '../config';

export default class DiscordLogService {
  static async send(message: string, details?: string, footer?: string) {
    const channel = await ((await sucrose).channels.fetch(channels.logs)) as TextChannel;
    if (channel) {
      return channel.send({
        embeds: [{
          description: `${message}${details ? `\n\n${details}` : ''}`,
          color: colors.grey,
          footer: { text: `${footer ? `${footer} • ` : ''}${Date().toLocaleString()}` },
        }],
      });
    } return null;
  }
}
