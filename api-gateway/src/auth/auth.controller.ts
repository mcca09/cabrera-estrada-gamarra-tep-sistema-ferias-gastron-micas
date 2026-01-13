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
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { catchError, firstValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  /*@Post('register')
  register(@Body() registerDto: any) {
    return this.authClient.send({ cmd: 'register' }, registerDto);
  }*/

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // Aquí NestJS ya validó que los datos cumplan con el DTO
    return this.authClient.send({ cmd: 'register_user' }, registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: any) {
    // Usamos firstValueFrom para manejar la respuesta como Promesa y capturar errores
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
    const userId = req.user?.id; // Usar optional chaining por seguridad

    if (!userId) {
      throw new HttpException('Usuario no identificado', HttpStatus.UNAUTHORIZED);
    }

    return this.authClient.send({ cmd: 'get_profile' }, { id: userId }).pipe(
      catchError(err => {
        throw new HttpException(
          err.message || 'Error al obtener perfil', 
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }),
    );
  }

  // ACTUALIZACIÓN: Endpoint para gestionar la actualización del perfil
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Req() req: any, @Body() updateData: any) {
    const userId = req.user?.id;
    if (!userId) throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);

    // ACTUALIZACIÓN: Enviamos el objeto 'updateData' tal cual viene de la petición.
    // Esto permite que si envías email, password, fullName o role, todos viajen al microservicio.
    return this.authClient.send(
      { cmd: 'update_profile' },
      { id: userId, updateData } // Enviamos el ID y el paquete de datos completo
    ).pipe(
      catchError(err => {
        throw new HttpException(err.message || 'Error en microservicio', HttpStatus.BAD_REQUEST);
      })
    );
  }
}
