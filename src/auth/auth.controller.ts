/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IUser } from 'src/types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  register(@Body() body: IUser) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: IUser) {
    return this.authService.login(body);
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }

  @Get('users')
  getAllUsers() {
    return this.authService.getAllUsers();
  }
}



