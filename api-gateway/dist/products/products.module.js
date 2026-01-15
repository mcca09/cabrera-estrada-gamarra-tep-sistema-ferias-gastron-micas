"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const products_controller_1 = require("./products.controller");
const config_1 = require("@nestjs/config");
const jwt_strategy_1 = require("../auth/strategies/jwt.strategy");
const passport_1 = require("@nestjs/passport");
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            microservices_1.ClientsModule.registerAsync([
                {
                    name: 'PRODUCTS_SERVICE',
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: (configService) => ({
                        transport: microservices_1.Transport.TCP,
                        options: {
                            host: configService.get('PRODS_HOST') || 'localhost',
                            port: 3003,
                        },
                    }),
                },
                {
                    name: 'STALLS_SERVICE',
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: (configService) => ({
                        transport: microservices_1.Transport.TCP,
                        options: {
                            host: configService.get('PRODS_HOST') || 'localhost',
                            port: 3004,
                        },
                    }),
                },
            ]),
        ],
        controllers: [products_controller_1.ProductsController],
        providers: [jwt_strategy_1.JwtStrategy],
    })
], ProductsModule);
//# sourceMappingURL=products.module.js.map