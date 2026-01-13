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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const rxjs_1 = require("rxjs");
const register_dto_1 = require("./dto/register.dto");
let AuthController = class AuthController {
    authClient;
    constructor(authClient) {
        this.authClient = authClient;
    }
    async register(registerDto) {
        return this.authClient.send({ cmd: 'register_user' }, registerDto);
    }
    async login(loginDto) {
        return (0, rxjs_1.firstValueFrom)(this.authClient.send({ cmd: 'login' }, loginDto).pipe((0, rxjs_1.catchError)((err) => {
            throw new common_1.HttpException(err.message || 'Error en el microservicio de Auth', err.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        })));
    }
    updateProfile(req, updateData) {
        const userId = req.user?.id;
        if (!userId)
            throw new common_1.HttpException('Token inválido', common_1.HttpStatus.UNAUTHORIZED);
        return this.authClient.send({ cmd: 'update_profile' }, { id: userId, updateData }).pipe((0, rxjs_1.catchError)(err => {
            throw new common_1.HttpException(err.message || 'Error en microservicio', common_1.HttpStatus.BAD_REQUEST);
        }));
    }
    deleteProfile(req, deleteData) {
        const userId = req.user?.id;
        if (!userId)
            throw new common_1.HttpException('Token inválido', common_1.HttpStatus.UNAUTHORIZED);
        return this.authClient.send({ cmd: 'delete_profile' }, { id: userId }).pipe((0, rxjs_1.catchError)(err => {
            throw new common_1.HttpException(err.message || 'Error en microservicio', common_1.HttpStatus.BAD_REQUEST);
        }));
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('profile'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('profile'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "deleteProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __param(0, (0, common_1.Inject)('AUTH_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], AuthController);
//# sourceMappingURL=auth.controller.js.map