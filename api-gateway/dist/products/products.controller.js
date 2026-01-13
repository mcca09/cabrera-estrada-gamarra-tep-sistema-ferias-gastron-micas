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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const stall_ownership_guard_1 = require("./stall-ownership.guard");
let ProductsController = class ProductsController {
    productsClient;
    stallsClient;
    constructor(productsClient, stallsClient) {
        this.productsClient = productsClient;
        this.stallsClient = stallsClient;
    }
    async getPublicCatalog(stall_id, category, minPrice, maxPrice) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.stallsClient.send({ cmd: 'get_active_stalls' }, {}));
            console.log('Respuesta cruda de Stalls:', response);
            const activeStalls = response.map((s) => s.id);
            if (activeStalls.length === 0)
                return [];
            const products = await (0, rxjs_1.firstValueFrom)(this.productsClient.send({ cmd: 'get_filtered_products' }, { stall_id, category, minPrice, maxPrice, activeStalls }));
            return products;
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener el catálogo de productos. Verifique la conexión con los servicios.', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
    create(createProductDto) {
        const data = {
            ...createProductDto,
            is_available: false
        };
        return this.productsClient
            .send({ cmd: 'create_product' }, data)
            .pipe((0, operators_1.catchError)(() => (0, rxjs_1.throwError)(() => new common_1.HttpException('Hubo un problema al registrar el producto. Por favor, revisa los datos e intenta de nuevo.', common_1.HttpStatus.BAD_REQUEST))));
    }
    findAll() {
        return this.productsClient.send({ cmd: 'get_all_products' }, {}).pipe((0, operators_1.catchError)(() => {
            throw new common_1.HttpException('Servicio de Productos no disponible', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }));
    }
    findOne(id) {
        return this.productsClient.send({ cmd: 'get_product_by_id' }, id).pipe((0, operators_1.catchError)(() => {
            throw new common_1.HttpException('Producto no encontrado', common_1.HttpStatus.NOT_FOUND);
        }));
    }
    update(id, updateProductDto) {
        return this.productsClient
            .send({ cmd: 'update_product' }, { id, ...updateProductDto })
            .pipe((0, operators_1.catchError)(() => (0, rxjs_1.throwError)(() => new common_1.HttpException(`No se pudo actualizar el producto con ID: ${id}.`, common_1.HttpStatus.INTERNAL_SERVER_ERROR))));
    }
    remove(id) {
        return this.productsClient
            .send({ cmd: 'delete_product' }, id)
            .pipe((0, operators_1.catchError)(() => (0, rxjs_1.throwError)(() => new common_1.HttpException('Error al intentar eliminar el producto. Es posible que ya no esté disponible.', common_1.HttpStatus.INTERNAL_SERVER_ERROR))));
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)('public/catalog'),
    __param(0, (0, common_1.Query)('stall_id')),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('minPrice', new common_1.DefaultValuePipe(0), common_1.ParseFloatPipe)),
    __param(3, (0, common_1.Query)('maxPrice', new common_1.DefaultValuePipe(10000), common_1.ParseFloatPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getPublicCatalog", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('emprendedor'),
    (0, common_1.UseGuards)(stall_ownership_guard_1.StallOwnershipGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('emprendedor'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('emprendedor'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('emprendedor'),
    (0, common_1.UseGuards)(stall_ownership_guard_1.StallOwnershipGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('emprendedor'),
    (0, common_1.UseGuards)(stall_ownership_guard_1.StallOwnershipGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", rxjs_1.Observable)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Inject)('PRODUCTS_SERVICE')),
    __param(1, (0, common_1.Inject)('STALLS_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy,
        microservices_1.ClientProxy])
], ProductsController);
//# sourceMappingURL=products.controller.js.map