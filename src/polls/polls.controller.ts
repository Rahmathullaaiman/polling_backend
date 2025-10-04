/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Body, Param, Req, UseGuards, Delete, Put } from '@nestjs/common';
import { PollsService } from './polls.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/schemas/userschema';
import { Roles } from 'src/auth/roles.decorator';
import { ICreatePollDto, IVoteDto, IUpdatePollDto } from 'src/types';

@Controller('polls')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PollsController {
  constructor(private pollsService: PollsService) { }

  @Post('create')
  @Roles(Role.ADMIN)
  create(@Req() req, @Body() body: ICreatePollDto) {
    return this.pollsService.createPoll(
      req.user,
      body
    );
  }

  @Get()
  getAll(@Req() req) {
    return this.pollsService.getPolls(req.user);
  }

  @Post(':id/vote')
  vote(@Req() req, @Param('id') id: string, @Body() body: IVoteDto) {
    return this.pollsService.vote(req.user, id, body);
  }

  @Get('results')
  getAllResults(@Req() req) {
    return this.pollsService.getAllResults(req.user);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() body: IUpdatePollDto
  ) {
    return this.pollsService.updatePoll(
      req.user,
      id,
      body
    );
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  delete(@Req() req, @Param('id') id: string) {
    return this.pollsService.deletePoll(req.user, id);
  }
}