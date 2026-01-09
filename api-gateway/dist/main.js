"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const rpc_exception_filter_1 = require("./common/rpc-exception.filter");
async function bootstrap() {
    const logger = new common_1.Logger('Main-Gateway');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new rpc_exception_filter_1.AllExceptionsFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors();
    const PORT = process.env.PORT || 3000;
    await app.listen(PORT);
    logger.log(`API Gateway running on: http://localhost:${PORT}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map