/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, User, UserDocument } from 'src/schemas/userschema';
import * as bcrypt from 'bcryptjs';
import { validateUserInput } from 'src/helpers/validateUserInput';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }


  async createUser(username: string, password: string, role?: Role) {
    console.log("Creating user:", { username, role, password });

    try {
      await validateUserInput(
        username,
        password,
        role,
        async (uname: string) => !!(await this.userModel.findOne({ username: uname }))
      );

      const hashedPassword = await bcrypt.hash(password, 10);

      let permissions = {};
      if (role === Role.ADMIN) {
        permissions = { isAdmin: true, canEdit: true };
      } else {
        permissions = { isAdmin: false, canEdit: true };
      }

      const user = new this.userModel({
        username,
        password: hashedPassword,
        role: role || Role.USER,
        permissions,
      });

      await user.save();

      return {
        success: true,
        message: "Successfully Registered",
        data: {
          id: user.id,
          username: user.username,
          role: user.role,
          permissions: user.permissions,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }


  async findByUsername(username: string) {
    return this.userModel.findOne({ username }).select('+username +role +password');
  }

  async findById(id: string) {
    return this.userModel.findById(id).select('-password');
  }
// users.service.ts
async getAllNormalUsers() {
  try {
    const users = await this.userModel.find(
      { role: 'user' },
      'username role permissions'
    );
    return users;
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
}


}
