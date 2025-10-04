/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Body, Param, Req, UseGuards, Delete, Put } from '@nestjs/common';
import { PollsService } from './polls.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/schemas/userschema';
import { Roles } from 'src/auth/roles.decorator';

@Controller('polls')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PollsController {
  constructor(private pollsService: PollsService) { }

  @Post('create')
  @Roles(Role.ADMIN)
  create(@Req() req, @Body() body: any) {
    return this.pollsService.createPoll(req.user, body.title, body.options, body.duration, body.visibility, body.allowedUsers || []);
  }

  @Get()
  getAll(@Req() req) {
    return this.pollsService.getPolls(req.user);
  }

  @Post(':id/vote')
  vote(@Req() req, @Param('id') id: string, @Body() body: { option: string }) {
    return this.pollsService.vote(req.user, id, body.option);
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
    @Body() body: { title?: string, options?: string[], duration?: number, visibility?: 'public' | 'private', allowedUsers?: string[] }
  ) {
    return this.pollsService.updatePoll(
      req.user,
      id,
      body.title,
      body.options,
      body.duration,
      body.visibility,
      body.allowedUsers
    );
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  delete(@Req() req, @Param('id') id: string) {
    return this.pollsService.deletePoll(req.user, id);
  }
}
