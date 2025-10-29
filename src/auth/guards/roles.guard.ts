import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/auth.decorator';
import { RoleEnum } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<RoleEnum[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) return true; // no se requieren roles

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(user);
    if (!user) {
      // si no hay user, significa que no pasó el AuthGuard
      throw new UnauthorizedException('User not authenticated');
    }

    console.log(user);

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('User does not have required role');
    }

    return true;
  }
}
