import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { EncryptionModule } from './encryption/encryption.module';
import { EncryptionInterceptor } from './encryption/interceptors/encryption.interceptor';
import { GptModule } from './gpt/gpt.module';
import { NeuraModule } from './neura/neura.module';

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
  ],
  controllers: [],
  providers: [
    ...(enableEncryption
      ? [
          {
            provide: APP_INTERCEPTOR,
            useClass: EncryptionInterceptor,
          },
        ]
      : []),
  ],
})
export class AppModule {}
