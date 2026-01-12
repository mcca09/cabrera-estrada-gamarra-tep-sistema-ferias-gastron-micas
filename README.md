# cabrera-estrada-gamarra-tep-sistema-ferias-gastron-micas
Proyecto Final - Tópicos Especiales de Programación

## Arquitectura de Carpetas api-gateway

api-gateway/
├── src/
│   ├── auth/                    # Lógica para interceptar y validar JWT
│   │   ├── auth.controller.ts   # Endpoints de login/registro (redirigen al micro de usuarios)
│   │   ├── auth.module.ts       # Registro de clientes proxy (TCP)
│   │   ├── auth.service.ts      # Lógica de comunicación con Microservicio de Usuarios
│   │   ├── jwt-auth.guard.ts    # Guard para proteger rutas globales
│   │   ├── jwt.strategy.ts      # Estrategia de Passport para leer el token
│   │   ├── roles.decorator.ts   # Decorador para marcar roles (@Roles('admin'))
│   │   └── roles.guard.ts       # Guard para verificar si el rol del JWT tiene permiso
│   ├── common/                  # Recursos compartidos
│   │   ├── rpc-exception.filter.ts # Captura errores de los microservicios y los devuelve como HTTP
│   │   └── dto/                 # Data Transfer Objects (validación de entrada)
│   ├── orders/                  # Proxy hacia el Microservicio de Pedidos
│   │   ├── orders.controller.ts # Endpoints para pedidos. Valida el rol de 'cliente' antes de enviar al micro.
│   │   └── orders.module.ts     # Configura el Cliente Proxy TCP para pedidos
│   ├── products/                # Proxy hacia el Microservicio de Productos
│   │   ├── products.controller.ts # Endpoints para el catálogo. Filtra búsquedas y gestiona CRUD de productos.
│   │   └── products.module.ts   # Configura el cliente TCP para conectar con el Micro de Productos.
│   ├── stalls/                  # Proxy hacia el Microservicio de Puestos
│   │   ├── stalls.controller.ts # Endpoints para puestos. Controla aprobación (organizador) y creación (emprendedor).
│   │   └── stalls.module.ts     # Configura el cliente TCP para conectar con el Micro de Puestos.
│   ├── app.module.ts            # Módulo raíz que orquesta todos los proxies
│   └── main.ts                  # Configuración de entrada (Puerto, Prefijo global, Validaciones)

## Requisitos Previos

1. Node.js
2. PostgreSQL
3. NestJS CLI (npm i -g @nestjs/cli)

## Instalación y Configuración

1. Instalación de Dependencias
Abre la terminal del microservicio y ejecuta los siguientes comandos:

npm install @nestjs/microservices # Comunicación con Microservicios
npm install @nestjs/jwt @nestjs/passport passport passport-jwt # Seguridad, Autenticación (JWT) y Autorización (Roles)
npm install -D @types/passport-jwt @types/passport-local # Tipos para TypeScript (Desarrollo)
npm install class-validator class-transformer # Validación de los datos que envía el cliente (Postman)
npm install nest-winston winston # Registro de acciones (Logging) requerido en el punto 8 del proyecto

2. Variables de Entorno
Crea un archivo .env en la raíz del microservicio con los datos de tu base de datos:

PORT=3000
NODE_ENV=development

AUTH_HOST=localhost
AUTH_PORT=3001

ORDERS_HOST=localhost
ORDERS_PORT=3002

PRODS_HOST=localhost
PRODS_PORT=3003

STALLS_HOST=localhost
STALLS_PORT=3004

3. Seguridad
JWT_SECRET=password

4. Ejecución
npm run start:dev

===================================================================

## Arquitectura de Carpetas auth-service

src/
├── auth/                        # Lógica de Seguridad y Credenciales
│   ├── interfaces/              # Definición de tipos para payloads y tokens.
│   ├── auth.controller.ts       # Endpoints de Login y validación de tokens.
│   ├── auth.module.ts           # Integración de JWT, Passport y Users.
│   ├── auth.service.ts          # Lógica de cifrado y generación de tokens.
│   ├── jwt-auth.guard.ts        # Guardián para proteger rutas privadas.
│   ├── jwt.strategy.ts          # Configuración de validación de la firma JWT.
│   ├── roles.decorator.ts       # Decorador para marcar roles requeridos en rutas.
│   └── roles.guard.ts           # Validador de permisos según el rol del usuario.
├── common/                      # Transversales (AOP)
│   ├── http-exception.filter.ts # Manejo estandarizado de errores.
│   └── logging.interceptor.ts   # Registro de auditoría en la tabla api_logs.
├── database/                    # Persistencia
│   ├── api-log.entity.ts        # Entidad para la tabla de logs.
│   └── database.config.ts       # Configuración de TypeORM para PostgreSQL.
├── users/                       # Gestión de Perfiles
│   ├── user.entity.ts           # Mapeo de la tabla 'users'.
│   ├── users.module.ts          # Encapsulamiento del dominio de usuarios.
│   └── users.service.ts         # CRUD de usuarios y búsqueda por email.
├── app.module.ts                # Módulo raíz.
└── main.ts                      # Punto de entrada (Configurado para RPC/TCP).

## Requisitos Previos

1. Node.js
2. PostgreSQL
3. NestJS CLI (npm i -g @nestjs/cli)

## Instalación y Configuración

1. Instalación de Dependencias
Abre la terminal del microservicio y ejecuta los siguientes comandos:

npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt # Seguridad y JWT
npm install --save-dev @types/passport-jwt @types/bcrypt # Seguridad y JWT
npm install @nestjs/typeorm typeorm pg @nestjs/config # Base de Datos y Configuración
npm install @nestjs/microservices class-validator class-transformer # Microservicios y Validación

2. Variables de Entorno
Crea un archivo .env en la raíz del microservicio con los datos de tu base de datos:

TCP_HOST=localhost
TCP_PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=auth_service

JWT_SECRET=password
JWT_EXPIRES_IN=24h

3. Ejecución
npm run start:dev

===================================================================

## Arquitectura de Carpetas stalls-service

src/
├── common/                      # Lógica compartida (AOP - Programación Orientada a Aspectos)
│   ├── http-exception.filter.ts # Captura y formatea errores para respuestas consistentes.
│   └── logging.interceptor.ts   # Registra cada petición (ruta, método, usuario) en la DB.
├── database/                    # Configuración de persistencia
│   ├── api-log.entity.ts        # Entidad TypeORM para la tabla de logs.
│   └── database.config.ts       # Configuración de conexión a PostgreSQL.
├── stalls/                      # Módulo principal del dominio
│   ├── create-stall.dto.ts      # Data Transfer Object: define y valida los datos de entrada.
│   ├── stalls.controller.ts     # Define los endpoints y gestiona las peticiones HTTP/RPC.
│   ├── stalls.entity.ts         # Mapeo de la tabla 'stalls' a nivel de código.
│   ├── stalls.module.ts         # Orquestador del módulo (une servicio, controlador y entidad).
│   └── stalls.service.ts        # Lógica de negocio (reglas de aprobación, validación de dueño).
├── app.module.ts                # Módulo raíz que integra la base de datos y los submódulos.
└── main.ts                      # Punto de entrada: Configura el microservicio (TCP/RPC).

## Requisitos Previos

1. Node.js
2. PostgreSQL
3. NestJS CLI (npm i -g @nestjs/cli)

## Instalación y Configuración

1. Instalación de Dependencias
Abre la terminal del microservicio y ejecuta los siguientes comandos:

npm install @nestjs/typeorm typeorm pg @nestjs/config # Core y Base de Datos
npm install @nestjs/microservices # Microservicios (RPC)
npm install class-validator class-transformer # Validaciones (DTOs)
npm install --save-dev @types/bcrypt @types/passport-jwt @types/passport-strategy @types/jsonwebtoken @types/passport @types/ms


2. Variables de Entorno
Crea un archivo .env en la raíz del microservicio con los datos de tu base de datos:

TCP_HOST=localhost
TCP_PORT=3004

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=stalls_service

3. Ejecución
npm run start:dev

===================================================================

## Arquitectura de Carpetas products-service

src/
├── common/                      # Programación Orientada a Aspectos (AOP)
│   ├── http-exception.filter.ts # Filtro global para estandarizar respuestas de error.
│   └── logging.interceptor.ts   # Interceptor para registrar acciones en la tabla api_logs.
├── database/                    # Infraestructura de Persistencia
│   ├── api-log.entity.ts        # Entidad para el registro de auditoría (logs).
│   └── database.config.ts       # Configuración de TypeORM y conexión a PostgreSQL.
├── products/                    # Módulo de Dominio (Lógica de Negocio)
│   ├── create-product.dto.ts    # Validaciones de entrada (nombre, precio, stock, etc.).
│   ├── products.controller.ts   # Definición de entry-points RPC y controladores.
│   ├── products.entity.ts       # Mapeo de la tabla 'products'.
│   ├── products.module.ts       # Orquestador del módulo de productos.
│   └── products.service.ts      # Reglas de negocio (validación de stock y asociación con puestos).
├── app.module.ts                # Módulo raíz que integra la base de datos y el dominio.
└── main.ts                      # Configuración del microservicio (TCP/RPC).

## Requisitos Previos

1. Node.js
2. PostgreSQL
3. NestJS CLI (npm i -g @nestjs/cli)

## Instalación y Configuración

1. Instalación de Dependencias
Abre la terminal del microservicio y ejecuta los siguientes comandos:

npm install @nestjs/typeorm typeorm pg @nestjs/config # Core y Base de Datos
npm install @nestjs/microservices # Microservicios (RPC)
npm install class-validator class-transformer # Validaciones (DTOs)
npm install --save-dev @types/bcrypt @types/passport-jwt @types/passport-strategy @types/jsonwebtoken @types/passport @types/ms


2. Variables de Entorno
Crea un archivo .env en la raíz del microservicio con los datos de tu base de datos:

TCP_HOST=localhost
TCP_PORT=3003

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=products_service

3. Ejecución
npm run start:dev

===================================================================

## Arquitectura de Carpetas orders-service

src/
├── common/                      # Programación Orientada a Aspectos (AOP)
│   ├── http-exception.filter.ts # Captura errores y estandariza la respuesta al Gateway.
│   └── logging.interceptor.ts   # Registra cada pedido y acción en la tabla api_logs.
├── database/                    # Capa de Persistencia
│   ├── api-log.entity.ts        # Entidad para auditoría de transacciones.
│   └── database.config.ts       # Configuración de TypeORM para PostgreSQL.
├── orders/                      # Dominio de Pedidos (Lógica Principal)
│   ├── create-order.dto.ts      # Validación de datos de entrada (productos, cantidades).
│   ├── order.entity.ts          # Mapeo de la tabla 'orders' (cabecera del pedido).
│   ├── order-item.entity.ts     # Mapeo de la tabla 'order_items' (detalle de productos).
│   ├── orders.controller.ts     # Entry-points para comunicación RPC (TCP).
│   ├── orders.module.ts         # Registro de proveedores, entidades y clientes RPC.
│   └── orders.service.ts        # Lógica de negocio (cálculo de totales, validación de stock).
├── app.module.ts                # Módulo raíz del microservicio.
└── main.ts                      # Configuración del listener TCP/RPC.

## Requisitos Previos

1. Node.js
2. PostgreSQL
3. NestJS CLI (npm i -g @nestjs/cli)

## Instalación y Configuración

1. Instalación de Dependencias
Abre la terminal del microservicio y ejecuta los siguientes comandos:

npm install @nestjs/typeorm typeorm pg @nestjs/config # Core y Base de Datos
npm install @nestjs/microservices # Microservicios (RPC)
npm install class-validator class-transformer # Validaciones (DTOs)
npm install --save-dev @types/bcrypt @types/passport-jwt @types/passport-strategy @types/jsonwebtoken @types/passport @types/ms

2. Variables de Entorno
Crea un archivo .env en la raíz del microservicio con los datos de tu base de datos:

TCP_HOST=localhost
TCP_PORT=3002

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=orders_service

3. Ejecución
npm run start:dev