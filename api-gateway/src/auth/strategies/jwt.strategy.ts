import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // Extrae el token de la cabecera 'Authorization: Bearer <token>'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // IMPORTANTE: Esta clave debe ser IGUAL a la del microservicio
      secretOrKey: configService.get<string>('JWT_SECRET') || 'password',
    });
  }

  async validate(payload: any) {
    // Si el token es válido, inyecta el usuario en req.user
    if (!payload) {
      throw new UnauthorizedException('Token no contiene información');
    }
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}