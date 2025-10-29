import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { SeedService } from './services/seed.service';
import { UserSeed } from './services/user.seed';

@Module({
  providers: [SeedService, UserSeed],
  imports: [AuthModule],
  exports: [SeedService],
})
export class SeedModule {}
