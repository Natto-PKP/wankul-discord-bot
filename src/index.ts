import { Sucrose } from 'discord-sucrose';
import { GatewayIntentBits, Partials } from 'discord.js';

import './dotenv';
import './database';

import Cooldown from './services/Cooldown';

Sucrose.build({
  env: { ext: 'ts', source: 'src' },
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel],
  cooldown: Cooldown,
});
