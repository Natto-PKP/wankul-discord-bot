import type { EventModule } from 'discord-sucrose';

export default <EventModule<'ready'>>{
  label: 'deploy',

  exec: async ({ sucrose }) => {
    await sucrose.interactions.commands.deploy('eval');
  },
};
