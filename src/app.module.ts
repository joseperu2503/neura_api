import { Module } from '@nestjs/common';
import { GptModule } from './gpt/gpt.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NeuraModule } from './neura/neura.module';
@Module({
  imports: [
    GptModule,
    ConfigModule.forRoot(),

    MongooseModule.forRoot('mongodb://localhost:27017/neura_db'),

    NeuraModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
