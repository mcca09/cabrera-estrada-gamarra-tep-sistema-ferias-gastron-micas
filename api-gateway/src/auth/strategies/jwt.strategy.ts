import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'password',
    });
  }

  async validate(payload: any) {
    console.log('Payload recibido:', payload);
    if (!payload) {
      throw new UnauthorizedException();
    }
    return { id: payload.sub || payload.id, email: payload.email, role: payload.role };
  }
}