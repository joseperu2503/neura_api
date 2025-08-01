import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EncryptionService } from '../services/encryption.service';

@Injectable()
export class EncryptionInterceptor implements NestInterceptor {
  constructor(private readonly encryptionService: EncryptionService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.method !== 'GET' && request.body) {
      try {
        request.body = this.encryptionService.decrypt(request.body);
      } catch (error) {
        throw new BadRequestException('Failed to decrypt the request body');
      }
    }

    return next.handle().pipe(
      map((data) => {
        // Encriptar la respuesta antes de enviarla al cliente
        return this.encryptionService.encrypt(data);
      }),
    );
  }
}
