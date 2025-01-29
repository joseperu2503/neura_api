import { Module } from '@nestjs/common';
import { GptModule } from './gpt/gpt.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NeuraModule } from './neura/neura.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    GptModule,
    ConfigModule.forRoot(),

    MongooseModule.forRoot(
      `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    ),

    NeuraModule,

    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
