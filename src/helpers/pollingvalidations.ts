/* eslint-disable prettier/prettier */
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Role } from 'src/schemas/userschema';

export function validateAdmin(user: any) {
  if (user.role !== Role.ADMIN) throw new ForbiddenException('Only admins can create polls');
}

export function validatePollTitleAndOptions(title: string, options: string[]) {
  if (!title || options.length < 2) throw new BadRequestException('Poll must have a title and at least 2 options');
}

export function validatePollDuration(duration: number) {
  const minutes = Number(duration);
  if (minutes <= 0 || minutes > 120) {
    throw new BadRequestException('Poll duration must be between 1 and 120 minutes');
  }
  return minutes;
}

export function validatePollOwner(poll: any, user: any) {
  if (poll.createdBy.toString() !== user.userId) {
    throw new ForbiddenException('You cannot edit this poll');
  }
}

export function validateVoteConditions(poll: any, user: any, option: string) {
  if (!poll) throw new NotFoundException('Poll not found');
  if (poll.expiresAt < new Date()) {
    throw new BadRequestException('Poll has expired');
  }
  if (poll.visibility === 'private' && user.role !== 'admin' &&
    !poll.allowedUsers.includes(user.userId)
  ) {
    throw new ForbiddenException('You are not allowed to vote on this poll');
  }
  for (const voters of Object.values(poll.votes)) {
    if ((voters as string[]).includes(user.userId)) {
      throw new BadRequestException('You have already voted');
    }
  }
  if (!poll.options.includes(option)) {
    throw new BadRequestException('Invalid option');
  }
}
export function validateAlreadyVoted(poll: any, user: any) {
  for (const voters of Object.values(poll.votes)) {
    if ((voters as string[]).includes(user.userId)) {
      throw new BadRequestException('You have already voted');
    }
  }
}
export function validateUpdatePollConditions(poll: any, user: any) {
  if (!poll) throw new NotFoundException('Poll not found');
  if (poll.createdBy.toString() !== user.userId) {
    throw new ForbiddenException('You cannot edit this poll');
  }
  if (poll.expiresAt < new Date()) {
    throw new BadRequestException('Poll already expired, cannot edit');
  }
}
