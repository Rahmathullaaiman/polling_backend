/* eslint-disable prettier/prettier */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SecurityInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data) => {
        if (data && data.user && data.user.password) {
          delete data.user.password;
        }
        return data;
      }),
    );
  }
}
