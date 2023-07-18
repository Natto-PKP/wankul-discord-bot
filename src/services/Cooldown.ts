import { BaseCooldownManager, CooldownMethodParams, CooldownValue } from 'discord-sucrose';
import cron from 'node-cron';

const cache = new Map<string, CooldownValue>();

cron.schedule('0 4 * * *', () => cache.clear());

class Cooldown extends BaseCooldownManager<typeof cache> {
  constructor() {
    super(cache);
  }

  public override async get({ key }: CooldownMethodParams) {
    return this.cache.get(key);
  }

  public override async set({ key, value, stack }: CooldownMethodParams & CooldownValue) {
    console.log('set', key, value, stack);
    // ! COOLDOWN CASSER, REPARER LE PACKAGE
    this.cache.set(key, { value, stack });
  }
}

export default new Cooldown();
