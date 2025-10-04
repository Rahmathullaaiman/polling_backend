/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Poll, PollDocument } from 'src/schemas/pollschema';

@Injectable()
export class PollsExpiryService {
    constructor(@InjectModel(Poll.name) private pollModel: Model<PollDocument>) { }

  @Cron('*/2 * * * * *', { name: 'poll-expiry-check' })
    async handlePollExpiry() {
        const now = new Date();     
        const result = await this.pollModel.updateMany(
            { expiresAt: { $lt: now }, isExpired: false },
            { $set: { isExpired: true } }
        );

        if (result.modifiedCount > 0) {
            console.log(`✅ Marked ${result.modifiedCount} poll(s) as expired`);
        } else {
            console.log(`⏳ Poll expiry check triggered at ${now.toISOString()}`);
        }
    }
}