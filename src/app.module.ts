import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppVersionModule } from './app-version/app-version.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { EncryptionModule } from './encryption/encryption.module';
import { EncryptionInterceptor } from './encryption/interceptors/encryption.interceptor';
import { GeminiModule } from './gemini/gemini.module';
import { GptModule } from './gpt/gpt.module';
import { NeuraModule } from './neura/neura.module';
import { SeedCommand } from './seed/commands/seed.command';
import { SeedModule } from './seed/seed.module';

const enableEncryption = process.env.ENCRYPT === 'true';

@Module({
  imports: [
    GptModule,
    ConfigModule.forRoot(),

    MongooseModule.forRoot(
      `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`,
    ),

    NeuraModule,

    AuthModule,

    EncryptionModule,

    GeminiModule,

    AppVersionModule,

    SeedModule,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveStaticOptions: {
        index: false,
        fallthrough: false,
      },
      serveRoot: '/public',
    }),
  ],
  controllers: [AppController],
  providers: [
    ...(enableEncryption
      ? [
          {
            provide: APP_INTERCEPTOR,
            useClass: EncryptionInterceptor,
          },
        ]
      : []),
    SeedCommand,
  ],
})
export class AppModule {}
