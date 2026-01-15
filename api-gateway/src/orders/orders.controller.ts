import { Controller, Post, Body, Inject, Get, Param, Patch, UseGuards, Request, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderFilterDto } from './dto/order-filter.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; 
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum'; 

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(
    @Inject('ORDERS_SERVICE') private readonly ordersClient: ClientProxy,
  ) {}

  // -----------------------------------------------------
  // 1. CLIENTE: Crear Orden (Ya lo tenías bien)
  // -----------------------------------------------------
  @Post()
  @Roles(Role.CLIENTE) 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Crear una nueva orden de compra' })
  @ApiResponse({ status: 201, description: 'Orden creada exitosamente' })
  createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req: any) {
    const userId = req.user.id; 
    const orderData = {
      ...createOrderDto,
      customer_id: userId, // Inyección automática del ID
    };
    console.log('🚀 Gateway enviando orden segura:', orderData);
    return this.ordersClient.send({ cmd: 'create_order' }, orderData);
  }

  // -----------------------------------------------------
  // 2. CLIENTE: Ver Historial
  // -----------------------------------------------------
  @Get('user/:id')
  @Roles(Role.CLIENTE, Role.ORGANIZADOR) // El cliente ve las suyas, el admin puede ver cualquiera
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Obtener todas las órdenes de un usuario' })
  getUserOrders(@Param('id') id: string, @Request() req: any) {
    // OPCIONAL: Podrías forzar que id sea req.user.id si es CLIENTE para mayor seguridad
    return this.ordersClient.send({ cmd: 'get_user_orders' }, { customer_id: id });
  }

  // -----------------------------------------------------
  // 3. EMPRENDEDOR: Actualizar Estado
  // -----------------------------------------------------
  @Patch(':id/status')
  @Roles(Role.EMPRENDEDOR) // Solo el emprendedor cambia el estado
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Actualizar el estado de una orden' })
  updateStatus(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.ordersClient.send({ cmd: 'update_order_status' }, { id, status: updateOrderStatusDto.status });
  }

  // -----------------------------------------------------
  // 4. EMPRENDEDOR: Métricas de su puesto
  // -----------------------------------------------------
  @Get('stall/:id/stats')
  @Roles(Role.EMPRENDEDOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Métricas operativas del puesto' })
  getStallStats(@Param('id') id: string) {
    return this.ordersClient.send({ cmd: 'get_stall_stats' }, { stallId: id });
  }

  // -----------------------------------------------------
  // 5. ORGANIZADOR / ADMIN: Rutas de Gestión Global
  // -----------------------------------------------------
  
  @Get('analytics')
  @Roles(Role.ORGANIZADOR) 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Dashboard: Vista global del evento (con filtros)' })
  getAnalytics(@Query() filterDto: OrderFilterDto) {
    return this.ordersClient.send({ cmd: 'get_analytics' }, filterDto);
  }

  @Get('admin/all')
  @Roles(Role.ORGANIZADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Panel Org: Ver TODAS las órdenes' })
  findAllAdmin() { 
    return this.ordersClient.send({ cmd: 'get_all_orders_admin' }, {}); 
  }

  @Get('admin/best-seller')
  @Roles(Role.ORGANIZADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Panel Org: Producto estrella' })
  findBestSeller() { 
    return this.ordersClient.send({ cmd: 'get_best_seller' }, {}); 
  }

  @Get('admin/daily-volume')
  @Roles(Role.ORGANIZADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Panel Org: Reporte de ingresos diarios' })
  findDailyVolume() { 
    return this.ordersClient.send({ cmd: 'get_daily_volume' }, {}); 
  }
}