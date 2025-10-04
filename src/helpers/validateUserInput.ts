/* eslint-disable prettier/prettier */
import { BadRequestException } from '@nestjs/common';
import { Role } from 'src/schemas/userschema';

export async function validateUserInput(
  username: string,
  password: string,
  role?: string,
  checkDuplicate?: (username: string) => Promise<boolean>
) {
  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    throw new BadRequestException('Username is required and must be a valid string.');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }


  const validRoles = [Role.ADMIN, Role.USER];
  if (role && !validRoles.includes(role as Role)) {
    throw new BadRequestException(`Role must be one of: ${validRoles.join(', ')}`);
  }

  if (checkDuplicate) {
    const exists = await checkDuplicate(username);
    if (exists) {
      throw new BadRequestException('Username already exists.');
    }
  }
}
