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
  Delete,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { catchError, firstValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';
import { Role } from '../common/enums/role.enum';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authClient.send({ cmd: 'register_user' }, registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: any) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'login' }, loginDto).pipe(
        catchError((err) => {
          throw new HttpException(
            err.message || 'Error en el microservicio de Auth',
            err.status || HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
      ),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZADOR)
  @Get('users')
  async findAllUsers() {
    return this.authClient.send({ cmd: 'find_all_users' }, {}).pipe(
      catchError((err) => {
        throw new HttpException(err.message, err.status || HttpStatus.BAD_REQUEST);
      }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    const userId = req.user?.id;
    if (!userId) {
      throw new HttpException('Usuario no identificado', HttpStatus.UNAUTHORIZED);
    }
    return this.authClient.send({ cmd: 'get_profile' }, { id: userId }).pipe(
      catchError(err => {
        throw new HttpException(err.message || 'Error al obtener perfil', HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Req() req: any, @Body() updateData: any) {
    const userId = req.user?.id;
    if (!userId) throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
    return this.authClient.send({ cmd: 'update_profile' }, { id: userId, updateData }).pipe(
      catchError(err => {
        throw new HttpException(err.message || 'Error en microservicio', HttpStatus.BAD_REQUEST);
      })
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  deleteProfile(@Req() req: any, @Body() deleteData: any) {
    const userId = req.user?.id;
    if (!userId) throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
    return this.authClient.send({ cmd: 'delete_profile' }, { id: userId}).pipe(
      catchError(err => {
        throw new HttpException(err.message || 'Error en microservicio', HttpStatus.BAD_REQUEST);
      })
    );
  }
}