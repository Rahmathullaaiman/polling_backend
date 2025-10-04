/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

// 👇 Extend Express Request to include 'user'
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      userId: string;
      role: string;
    };
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    console.log(req);
    

    if (!authHeader) throw new UnauthorizedException('No token provided');

    const token = authHeader.split(' ')[1];
    if (!token) throw new UnauthorizedException('Invalid token format');
    console.log(token,"[jwt] token");
    

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
      console.log(decoded,"[jwt] decoded"); 
      
      req.user = { userId: decoded.sub, role: decoded.role };
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token',err);
    }
  }
}
