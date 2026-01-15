/*
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return roles.some((role) => user.role?.includes(role));
  }
}
*/

import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Obtenemos los roles definidos en el decorador @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si la ruta no tiene el decorador @Roles, se permite el acceso (es solo para autenticados)
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 2. Verificación de seguridad: ¿El usuario está autenticado?
    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado en el sistema');
    }

    // 3. Verificación de Rol: ¿El rol del usuario coincide con los permitidos?
    const hasRole = requiredRoles.includes(user.role as Role);

    if (!hasRole) {
      // Lanzamos 403 Forbidden si el rol no coincide
      throw new ForbiddenException(
        `Tu rol (${user.role}) no tiene permisos para acceder a este recurso. Se requiere: ${requiredRoles.join(' o ')}`
      );
    }

    return true;
  }
}

