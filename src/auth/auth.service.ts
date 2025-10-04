/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/schemas/userschema';
import { UsersService } from 'src/users/users.service';
import { validateUserCredentials } from 'src/helpers/validateUserCredentials';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async register(username: string, password: string, role: string) {
    try {
      const result = await this.usersService.createUser(username, password, role as Role);
      return {
        statusCode: 200,
        success: true,
        message: "User created successfully",
        data: result,
      };
    } catch (error) {
      return {
        statusCode: 200,
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }


  async login(username: string, password: string) {
    try {
      const user = await validateUserCredentials(this.usersService, username, password);

      if (!user) {
        return {
          statusCode: 401,
          success: false,
          message: "Invalid credentials",
        };
      }

      const payload = { sub: user.id, role: user.role };
      const { password: _, ...userWithoutPassword } =
        user.toObject ? user.toObject() : user;

      return {
        statusCode: 200,
        success: true,
        message: "Login successful",
        data: {
          access_token: this.jwtService.sign(payload),
          user: userWithoutPassword,
        },
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: error.message || "Something went wrong during login",
      };
    }
  }



  async logout() {
    return { message: 'Logout successful. Please discard your token.' };
  }

  async getAllUsers() {
    try {
      const users = await this.usersService.getAllNormalUsers();
      return {
        statusCode: 200,
        success: true,
        message: "Fetched users successfully",
        data: users,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: error.message || "Failed to fetch users",
      };
    }
  }
}