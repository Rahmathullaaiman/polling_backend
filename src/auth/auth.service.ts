/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/schemas/userschema';
import { UsersService } from 'src/users/users.service';
import { validateUserCredentials } from 'src/helpers/validateUserCredentials';
import { IUser } from 'src/types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async register(user: IUser) {
    try {
      const result = await this.usersService.createUser(user);
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

  async login(user: IUser) {
    try {
      const foundUser = await validateUserCredentials(this.usersService, user.username, user.password);

      if (!foundUser) {
        return {
          statusCode: 401,
          success: false,
          message: "Invalid credentials",
        };
      }

      const payload = { sub: foundUser.id, role: foundUser.role };
      const { password: _, ...userWithoutPassword } =
        foundUser.toObject ? foundUser.toObject() : foundUser;

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