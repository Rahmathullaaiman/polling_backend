/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Poll, PollDocument } from 'src/schemas/pollschema';
import { Role } from 'src/schemas/userschema';

@Injectable()
export class PollsService {
  constructor(@InjectModel(Poll.name) private pollModel: Model<PollDocument>) { }

  async createPoll(user: any, title: string, options: string[], duration: number, visibility: 'public' | 'private', allowedUsers: string[] = []) {
    if (user.role !== Role.ADMIN) throw new ForbiddenException('Only admins can create polls');
    if (!title || options.length < 2) throw new BadRequestException('Poll must have a title and at least 2 options');
    console.log(duration, "duxxr");

    const minutes = Number(duration);

    if (minutes <= 0 || minutes > 120) {
      throw new BadRequestException('Poll duration must be between 1 and 120 minutes');
    }
    const expiresAt = new Date(Date.now() + minutes * 60 * 1000);

    const poll = new this.pollModel({
      title,
      options,
      votes: {},
      visibility,
      allowedUsers,
      createdBy: user.userId,
      expiresAt,
      duration: minutes
    });
    return poll.save();
  }

  async getPolls(user: any) {
    const now = new Date();
    return this.pollModel.find({
      $or: [
        { visibility: 'public' },
        { visibility: 'private' }
      ]
    }).lean();
  }

  async vote(user: any, pollId: string, option: string) {
    try {
      const poll = await this.pollModel.findById(pollId);
      if (!poll) throw new NotFoundException('Poll not found');

      if (poll.expiresAt < new Date()) {
        throw new BadRequestException('Poll has expired');
      }

      if (poll.visibility === 'private' && user.role !== 'admin' &&
        !poll.allowedUsers.includes(user.userId)
      ) {
        throw new ForbiddenException('You are not allowed to vote on this poll');
      }

      for (const [opt, voters] of poll.votes.entries()) {
        if (voters.includes(user.userId)) {
          throw new BadRequestException('You have already voted');
        }
      }

      if (!poll.options.includes(option)) {
        throw new BadRequestException('Invalid option');
      }

      if (!poll.votes.has(option)) {
        poll.votes.set(option, []);
      }

      poll.votes.get(option).push(user.userId);

      await poll.save();

      return {
        success: true,
        message: 'Vote submitted successfully',
        pollId: poll._id,
        option,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'An error occurred while voting',
      };
    }
  }


  async getAllResults(user: any) {
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
  }



  async updatePoll(user: any, pollId: string, title?: string, options?: string[], duration?: number, visibility?: 'public' | 'private', allowedUsers?: string[]
  ) {
    console.log(duration, "viss");

    const poll = await this.pollModel.findById(pollId);
    if (!poll) throw new NotFoundException('Poll not found');

    if (poll.createdBy.toString() !== user.userId) {
      throw new ForbiddenException('You cannot edit this poll');
    }

    if (poll.expiresAt < new Date()) {
      throw new BadRequestException('Poll already expired, cannot edit');
    }

    if (title) poll.title = title;
    if (options && options.length >= 2) poll.options = options;

    if (duration) {
      const minutes = Number(duration);
      console.log(minutes, "update");

      if (minutes <= 0 || minutes > 120) {
        throw new BadRequestException('Poll duration must be between 1 and 120 minutes');
      }
      poll.duration = minutes;
      poll.expiresAt = new Date(Date.now() + minutes * 60 * 1000);
    }

    if (visibility) poll.visibility = visibility;
    if (visibility === 'private') {
      poll.allowedUsers = allowedUsers || [];
    } else if (visibility === 'public') {
      poll.allowedUsers = [];
    }

    return poll.save();
  }


  async deletePoll(user: any, pollId: string) {
    const poll = await this.pollModel.findById(pollId);
    if (!poll) throw new NotFoundException('Poll not found');
    if (poll.createdBy.toString() !== user.userId) throw new ForbiddenException('You cannot delete this poll');

    await poll.deleteOne();
    return { message: 'Poll deleted successfully' };
  }
}
