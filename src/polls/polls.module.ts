/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { PollsExpiryService } from './polls-expiry.service';
import { Poll, PollSchema } from 'src/schemas/pollschema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Poll.name, schema: PollSchema }])],
  controllers: [PollsController],
  providers: [PollsService, PollsExpiryService],
})
export class PollsModule {}
