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
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const rxjs_1 = require("rxjs");
const role_enum_1 = require("../common/enums/role.enum");
let StallsController = class StallsController {
    stallsClient;
    constructor(stallsClient) {
        this.stallsClient = stallsClient;
    }
    create(createStallDto, req) {
        const userId = req.user.id;
        const data = {
            ...createStallDto,
            ownerId: userId,
            status: 'pendiente'
        };
        return this.stallsClient.send({ cmd: 'create_stall' }, data);
    }
    findAll() {
        return this.stallsClient.send({ cmd: 'get_all_stalls' }, {});
    }
    findOne(id) {
        return this.stallsClient.send({ cmd: 'find_one_stall' }, id);
    }
    findAllActive() {
        return this.stallsClient.send({ cmd: 'get_active_stalls' }, {});
    }
    approve(id) {
        return this.stallsClient.send({ cmd: 'approve_stall' }, { id })
            .pipe((0, rxjs_1.catchError)(err => (0, rxjs_1.throwError)(() => err)));
    }
    disapprove(id) {
        return this.stallsClient.send({ cmd: 'disapprove_stall' }, { id })
            .pipe((0, rxjs_1.catchError)(err => (0, rxjs_1.throwError)(() => err)));
    }
    activate(id, req) {
        const ownerId = req.user.id;
        return this.stallsClient.send({ cmd: 'activate_stall' }, { id, ownerId })
            .pipe((0, rxjs_1.catchError)(err => (0, rxjs_1.throwError)(() => err)));
    }
    inactivate(id, req) {
        const ownerId = req.user.id;
        return this.stallsClient.send({ cmd: 'inactivate_stall' }, { id, ownerId })
            .pipe((0, rxjs_1.catchError)(err => (0, rxjs_1.throwError)(() => err)));
    }
    update(id, updateData, req) {
        const ownerId = req.user.id;
        if (!ownerId) {
            throw new common_1.UnauthorizedException('Token inválido o usuario no encontrado');
        }
        return this.stallsClient.send({ cmd: 'update_stall' }, { id, ownerId, updateData })
            .pipe((0, rxjs_1.catchError)(err => (0, rxjs_1.throwError)(() => err)));
    }
    remove(id, req) {
        console.log('PARAM ID:', id);
        console.log('REQ.USER:', req.user);
        if (!req.user?.id) {
            throw new common_1.UnauthorizedException('Token inválido o usuario no encontrado');
        }
        const ownerId = req.user.id;
        return this.stallsClient.send({ cmd: 'delete_stall' }, { id, ownerId })
            .pipe((0, rxjs_1.catchError)(err => (0, rxjs_1.throwError)(() => err)));
    }
};
exports.StallsController = StallsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.EMPRENDEDOR),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], StallsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.EMPRENDEDOR),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StallsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.EMPRENDEDOR),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StallsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('public'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StallsController.prototype, "findAllActive", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ORGANIZADOR),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StallsController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)(':id/disapprove'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ORGANIZADOR),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StallsController.prototype, "disapprove", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.EMPRENDEDOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StallsController.prototype, "activate", null);
__decorate([
    (0, common_1.Patch)(':id/inactivate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.EMPRENDEDOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StallsController.prototype, "inactivate", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.EMPRENDEDOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], StallsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.EMPRENDEDOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StallsController.prototype, "remove", null);
exports.StallsController = StallsController = __decorate([
    (0, common_1.Controller)('stalls'),
    __param(0, (0, common_1.Inject)('STALLS_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], StallsController);
//# sourceMappingURL=stalls.controller.js.map