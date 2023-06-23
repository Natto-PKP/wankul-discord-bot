import { BaseCooldownManager, CooldownMethodParams, CooldownValue } from 'discord-sucrose';

const cache = new Map<string, CooldownValue>();

class Cooldown extends BaseCooldownManager<typeof cache> {
  constructor() {
    super(cache);
  }

  public override async get({ key }: CooldownMethodParams) {
    return this.cache.get(key);
  }

  public override async set({ key, value, stack }: CooldownMethodParams & CooldownValue) {
    this.cache.set(key, { value, stack });
  }
}

export default new Cooldown();
