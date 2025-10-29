import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'src/auth/auth.module';
import { AppVersionController } from './controllers/app-version.controller';
import { AppVersion, AppVersionSchema } from './schemas/app-version.schema';
import { AppVersionService } from './services/app-version.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AppVersion.name, schema: AppVersionSchema },
    ]),
    AuthModule,
  ],
  providers: [AppVersionService],
  controllers: [AppVersionController],
})
export class AppVersionModule {}
