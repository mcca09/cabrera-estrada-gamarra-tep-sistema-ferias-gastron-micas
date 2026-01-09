import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Inject,
  Patch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from './jwt-auth.guard';
import { catchError, firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  register(@Body() registerDto: any) {
    return this.authClient.send({ cmd: 'register' }, registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: any) {
    // Usamos firstValueFrom para manejar la respuesta como Promesa y capturar errores
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return firstValueFrom(
      this.authClient.send({ cmd: 'login' }, loginDto).pipe(
        catchError(() => {
          throw new HttpException(
            'Error en el microservicio de Auth',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user?.id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return this.authClient.send({ cmd: 'get_profile' }, { id: userId });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Req() req: any, @Body() updateData: any) {
    /**
     * SOLUCIÓN AL ECONNRESET:
     * Extraemos el ID del token. Si req.user.id es null, el microservicio colapsa.
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user?.id;

    if (!userId) {
      throw new HttpException(
        'No se encontró el ID del usuario en el token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Enviamos el objeto estructurado
    return this.authClient
      .send(
        { cmd: 'update_profile' },
        {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: userId,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          updateData: updateData,
        },
      )
      .pipe(
        catchError(() => {
          // Esto evita que el Gateway lance el error de socket crudo
          throw new HttpException(
            'Error de comunicación con Auth-Service',
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }),
      );
  }
}
