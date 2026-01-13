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
let OrdersController = class OrdersController {
    ordersClient;
    constructor(ordersClient) {
        this.ordersClient = ordersClient;
    }
    createOrder(createOrderDto) {
        console.log('🚀 Gateway validó y recibió:', createOrderDto);
        return this.ordersClient.send({ cmd: 'create_order' }, createOrderDto);
    }
    getUserOrders(id) {
        return this.ordersClient.send({ cmd: 'get_user_orders' }, { customer_id: id });
    }
    updateStatus(id, updateOrderStatusDto) {
        console.log(`🔄 Gateway solicitando cambio de estado para orden ${id}:`, updateOrderStatusDto);
        return this.ordersClient.send({ cmd: 'update_order_status' }, { id, status: updateOrderStatusDto.status });
    }
    getStallStats(id) {
        return this.ordersClient.send({ cmd: 'get_stall_stats' }, { stallId: id });
    }
    getAllOrders(query) {
        return this.ordersClient.send({ cmd: 'get_all_orders_admin' }, query);
    }
    getBestSeller() {
        return this.ordersClient.send({ cmd: 'get_best_seller' }, {});
    }
    getDailyVolume() {
        return this.ordersClient.send({ cmd: 'get_daily_volume' }, {});
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva orden de compra' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Orden creada exitosamente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('user/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las órdenes de un usuario' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getUserOrders", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar el estado de una orden' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado actualizado correctamente' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_status_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('stall/:id/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener el total de ventas de un puesto específico' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getStallStats", null);
__decorate([
    (0, common_1.Get)('admin/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Vista global de pedidos (Filtros: ?date=YYYY-MM-DD&stallId=X&status=Y)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getAllOrders", null);
__decorate([
    (0, common_1.Get)('admin/best-seller'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener el producto más vendido de la feria' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getBestSeller", null);
__decorate([
    (0, common_1.Get)('admin/daily-volume'),
    (0, swagger_1.ApiOperation)({ summary: 'Ver reporte de ventas totales agrupadas por día' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getDailyVolume", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, common_1.Controller)('orders'),
    __param(0, (0, common_1.Inject)('ORDERS_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map