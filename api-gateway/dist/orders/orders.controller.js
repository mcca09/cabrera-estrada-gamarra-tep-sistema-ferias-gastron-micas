"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const swagger_1 = require("@nestjs/swagger");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_status_dto_1 = require("./dto/update-order-status.dto");
const order_filter_dto_1 = require("./dto/order-filter.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
let OrdersController = class OrdersController {
    ordersClient;
    constructor(ordersClient) {
        this.ordersClient = ordersClient;
    }
    createOrder(createOrderDto, req) {
        const userId = req.user.id;
        const orderData = {
            ...createOrderDto,
            customer_id: userId,
        };
        console.log('🚀 Gateway enviando orden segura:', orderData);
        return this.ordersClient.send({ cmd: 'create_order' }, orderData);
    }
    getUserOrders(id, req) {
        return this.ordersClient.send({ cmd: 'get_user_orders' }, { customer_id: id });
    }
    updateStatus(id, updateOrderStatusDto) {
        return this.ordersClient.send({ cmd: 'update_order_status' }, { id, status: updateOrderStatusDto.status });
    }
    getStallStats(id) {
        return this.ordersClient.send({ cmd: 'get_stall_stats' }, { stallId: id });
    }
    getAnalytics(filterDto) {
        return this.ordersClient.send({ cmd: 'get_analytics' }, filterDto);
    }
    findAllAdmin() {
        return this.ordersClient.send({ cmd: 'get_all_orders_admin' }, {});
    }
    findBestSeller() {
        return this.ordersClient.send({ cmd: 'get_best_seller' }, {});
    }
    findDailyVolume() {
        return this.ordersClient.send({ cmd: 'get_daily_volume' }, {});
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.CLIENTE),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva orden de compra' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Orden creada exitosamente' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('user/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.CLIENTE, role_enum_1.Role.ORGANIZADOR),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las órdenes de un usuario' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getUserOrders", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.EMPRENDEDOR),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar el estado de una orden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_status_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('stall/:id/stats'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.EMPRENDEDOR),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Métricas operativas del puesto' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getStallStats", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ORGANIZADOR),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Dashboard: Vista global del evento (con filtros)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_filter_dto_1.OrderFilterDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('admin/all'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ORGANIZADOR),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Panel Org: Ver TODAS las órdenes' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findAllAdmin", null);
__decorate([
    (0, common_1.Get)('admin/best-seller'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ORGANIZADOR),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Panel Org: Producto estrella' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findBestSeller", null);
__decorate([
    (0, common_1.Get)('admin/daily-volume'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ORGANIZADOR),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Panel Org: Reporte de ingresos diarios' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findDailyVolume", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('orders'),
    __param(0, (0, common_1.Inject)('ORDERS_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map