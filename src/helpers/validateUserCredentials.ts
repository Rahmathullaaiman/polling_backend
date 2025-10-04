/* eslint-disable prettier/prettier */
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';

export async function validateUserCredentials(
  usersService: UsersService,
  username: string,
  password: string
) {
  const user = await usersService.findByUsername(username);
  if (user && await bcrypt.compare(password, user.password)) {
    return user;
  }
  return null;
}
