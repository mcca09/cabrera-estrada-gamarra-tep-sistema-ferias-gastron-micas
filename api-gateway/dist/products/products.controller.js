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
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const rxjs_1 = require("rxjs");
let ProductsController = class ProductsController {
    productsClient;
    constructor(productsClient) {
        this.productsClient = productsClient;
    }
    findAll() {
        return this.productsClient.send({ cmd: 'get_all_products' }, {}).pipe((0, rxjs_1.catchError)(() => {
            throw new common_1.HttpException('Servicio de Productos no disponible', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }));
    }
    create(createProductDto) {
        return this.productsClient
            .send({ cmd: 'create_product' }, createProductDto)
            .pipe((0, rxjs_1.catchError)(() => {
            throw new common_1.HttpException('Error al crear producto', common_1.HttpStatus.BAD_REQUEST);
        }));
    }
    findOne(id) {
        return this.productsClient.send({ cmd: 'get_product_by_id' }, { id }).pipe((0, rxjs_1.catchError)(() => {
            throw new common_1.HttpException('Producto no encontrado', common_1.HttpStatus.NOT_FOUND);
        }));
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOne", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    __param(0, (0, common_1.Inject)('PRODUCTS_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], ProductsController);
//# sourceMappingURL=products.controller.js.map