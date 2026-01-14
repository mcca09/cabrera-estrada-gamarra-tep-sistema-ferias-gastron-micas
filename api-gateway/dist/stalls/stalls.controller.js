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
exports.StallsController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const rpc_exception_filter_1 = require("../common/rpc-exception.filter");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
let StallsController = class StallsController {
    stallsClient;
    constructor(stallsClient) {
        this.stallsClient = stallsClient;
    }
    create(createStallDto, req) {
        const payload = {
            ...createStallDto,
            ownerId: req.user.id,
        };
        return this.stallsClient.send({ cmd: 'create_stall' }, payload);
    }
    findAll() {
        return this.stallsClient.send({ cmd: 'find_all_stalls' }, {});
    }
    approve(id) {
        return this.stallsClient
            .send({ cmd: 'approve_stall' }, { id })
            .pipe((0, rxjs_1.catchError)((err) => (0, rxjs_1.throwError)(() => err)));
    }
    activate(id, req) {
        return this.stallsClient
            .send({ cmd: 'activate_stall' }, { id, ownerId: req.user.id })
            .pipe((0, rxjs_1.catchError)((err) => (0, rxjs_1.throwError)(() => err)));
    }
    inactivate(id, req) {
        return this.stallsClient
            .send({ cmd: 'inactivate_stall' }, { id, ownerId: req.user.id })
            .pipe((0, rxjs_1.catchError)((err) => (0, rxjs_1.throwError)(() => err)));
    }
    update(id, updateData, req) {
        return this.stallsClient
            .send({ cmd: 'update_stall' }, {
            id,
            ownerId: req.user.id,
            updateData,
        })
            .pipe((0, rxjs_1.catchError)((err) => (0, rxjs_1.throwError)(() => err)));
    }
    remove(id, req) {
        return this.stallsClient
            .send({ cmd: 'delete_stall' }, { id, ownerId: req.user.id })
            .pipe((0, rxjs_1.catchError)((err) => (0, rxjs_1.throwError)(() => err)));
    }
};
exports.StallsController = StallsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.EMPRENDEDOR),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], StallsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StallsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ORGANIZADOR),
    (0, common_1.Patch)(':id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StallsController.prototype, "approve", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.EMPRENDEDOR),
    (0, common_1.Patch)(':id/activate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StallsController.prototype, "activate", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.EMPRENDEDOR),
    (0, common_1.Patch)(':id/inactivate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StallsController.prototype, "inactivate", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.EMPRENDEDOR),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('updateData')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], StallsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.EMPRENDEDOR),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StallsController.prototype, "remove", null);
exports.StallsController = StallsController = __decorate([
    (0, common_1.Controller)('stalls'),
    (0, common_1.UseFilters)(rpc_exception_filter_1.AllExceptionsFilter),
    __param(0, (0, common_1.Inject)('STALLS_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], StallsController);
//# sourceMappingURL=stalls.controller.js.map