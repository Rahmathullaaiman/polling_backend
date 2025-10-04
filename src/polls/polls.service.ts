/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Poll, PollDocument } from 'src/schemas/pollschema';
import {
  validateAdmin,
  validatePollTitleAndOptions,
  validatePollDuration,
  validateVoteConditions,
  validateUpdatePollConditions
} from 'src/helpers/pollingvalidations';
import { ICreatePollDto, IVoteDto, IUpdatePollDto } from 'src/types';

@Injectable()
export class PollsService {
  constructor(@InjectModel(Poll.name) private pollModel: Model<PollDocument>) { }

  async createPoll(user: any, createPollDto: ICreatePollDto) {
    try {
      validateAdmin(user);
      validatePollTitleAndOptions(createPollDto.title, createPollDto.options);
      const minutes = validatePollDuration(createPollDto.duration);

      const expiresAt = new Date(Date.now() + minutes * 60 * 1000);

      const poll = new this.pollModel({
        title: createPollDto.title,
        options: createPollDto.options,
        votes: {},
        visibility: createPollDto.visibility,
        allowedUsers: createPollDto.allowedUsers || [],
        createdBy: user.userId,
        expiresAt,
        duration: minutes
      });
      return await poll.save();
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to create poll');
    }
  }

  async getPolls(user: any) {
    try {
      const now = new Date();
      return await this.pollModel.find({
        $or: [
          { visibility: 'public' },
          { visibility: 'private' }
        ]
      }).lean();
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to fetch polls');
    }
  }

  async vote(user: any, pollId: string, voteDto: IVoteDto) {
    try {
      const poll = await this.pollModel.findById(pollId);
      validateVoteConditions(poll, user, voteDto.option);

      if (!poll.votes[voteDto.option]) {
        poll.votes[voteDto.option] = [];
      }
      poll.votes[voteDto.option].push(user.userId);

      await poll.save();

      return {
        success: true,
        message: 'Vote submitted successfully',
        pollId: poll._id,
        option: voteDto.option,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'An error occurred while voting');
    }
  }

  async getAllResults(user: any) {
    try {
      const polls = await this.pollModel.find().lean();

      return polls.map((poll) => {
        const results: Record<string, number> = {};

        for (const option of poll.options) {
          results[option] = poll.votes?.[option]?.length || 0;
        }

        return {
          id: poll._id,
          title: poll.title,
          options: poll.options,
          visibility: poll.visibility,
          isExpired: poll.expiresAt < new Date(),
          results,
        };
      });
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to fetch poll results');
    }
  }

  async updatePoll(
    user: any,
    pollId: string,
    updatePollDto: IUpdatePollDto
  ) {
    try {
      const poll = await this.pollModel.findById(pollId);
      validateUpdatePollConditions(poll, user);

      if (updatePollDto.title) poll.title = updatePollDto.title;
      if (updatePollDto.options && updatePollDto.options.length >= 2) poll.options = updatePollDto.options;

      if (updatePollDto.duration) {
        const minutes = validatePollDuration(updatePollDto.duration);
        poll.duration = minutes;
        poll.expiresAt = new Date(Date.now() + minutes * 60 * 1000);
      }

      if (updatePollDto.visibility) poll.visibility = updatePollDto.visibility;
      if (updatePollDto.visibility === 'private') {
        poll.allowedUsers = updatePollDto.allowedUsers || [];
      } else if (updatePollDto.visibility === 'public') {
        poll.allowedUsers = [];
      }

      return await poll.save();
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to update poll');
    }
  }

  async deletePoll(user: any, pollId: string) {
    try {
      const poll = await this.pollModel.findById(pollId);
      await poll.deleteOne();
      return { message: 'Poll deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete poll');
    }
  }
}