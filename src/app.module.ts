import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { EncryptionModule } from './encryption/encryption.module';
import { GptModule } from './gpt/gpt.module';
import { NeuraModule } from './neura/neura.module';
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
  // providers: [
  //   {
  //     provide: APP_INTERCEPTOR,
  //     useClass: EncryptionInterceptor,
  //   },
  // ],
})
export class AppModule {}
