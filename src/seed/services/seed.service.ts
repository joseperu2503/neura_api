import { Injectable } from '@nestjs/common';

import { UserSeed } from './user.seed';

@Injectable()
export class SeedService {
  constructor(private readonly userSeed: UserSeed) {}

  async runSeed() {
    await this.userSeed.run();
  }
}
