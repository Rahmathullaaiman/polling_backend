/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/schemas/userschema';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
