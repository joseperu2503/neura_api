import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './features/auth/auth.module';
import { GptModule } from './features/gpt/gpt.module';
import { NeuraModule } from './features/neura/neura.module';
import { EncryptionModule } from './infrastructure/encryption/encryption.module';
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
