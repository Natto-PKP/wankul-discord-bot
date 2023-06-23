import { Logger as SucroseLogger } from 'discord-sucrose';
import type { EventModule } from 'discord-sucrose';
import Logger from '../../services/Logger';

export default <EventModule<'ready'>>{
  label: 'log',

  exec: () => {
    Logger.give('INFO', SucroseLogger.style("I'm connected", 'rainbow'));
  },
};
