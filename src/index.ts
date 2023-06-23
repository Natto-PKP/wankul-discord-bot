import { Sucrose } from 'discord-sucrose';
import { GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';

import Cooldown from './services/Cooldown';

dotenv.config();

Sucrose.build({
  env: { ext: 'ts', source: 'src' },
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel],
  cooldown: Cooldown,
});
