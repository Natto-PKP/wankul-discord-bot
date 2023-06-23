import type { EventModule } from 'discord-sucrose';
import Logger from '../../services/Logger';

export default <EventModule<'ready'>>{
  label: 'count',

  exec: ({ sucrose }) => {
    Logger.give('INFO', `${sucrose.guilds.cache.size} guilds`);
    Logger.give('INFO', `${sucrose.users.cache.size} users`);
  },
};
