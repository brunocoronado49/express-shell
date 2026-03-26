# Express Shell - Clean Architecture API

Una API RESTful construida con Express.js y MongoDB siguiendo los principios de **Clean Architecture** con separación clara de responsabilidades en capas.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Arquitectura](#arquitectura)
- [Patrones de Diseño](#patrones-de-diseño)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Setup](#instalación-y-setup)
- [Comandos Disponibles](#comandos-disponibles)
- [API Endpoints](#api-endpoints)

---

## 📝 Descripción

Express Shell es una aplicación de ejemplo que implementa una **arquitectura en capas limpia** para gestionar usuarios y categorías. El proyecto demuestra mejores prácticas en desarrollo de APIs REST con TypeScript, incluyendo autenticación JWT, validación de datos y manejo centralizado de errores.

---

## 🏗️ Arquitectura

El proyecto sigue una **arquitectura de 3 capas**:

```
src/
├── presentation/     (Capa de Presentación)
│   ├── routes.ts
│   ├── server.ts
│   ├── auth/
│   ├── category/
│   ├── middlewares/
│   └── services/
│
├── domain/          (Capa de Dominio - Lógica de Negocio)
│   ├── dtos/        (Data Transfer Objects - Validación de entrada)
│   ├── entities/    (Entidades del dominio)
│   └── errors/      (Manejo de errores)
│
├── data/            (Capa de Datos)
│   ├── index.ts
│   └── mongo/       (Modelos y conexión MongoDB)
│
├── config/          (Configuración)
│   ├── envs.ts
│   ├── jwt.adapter.ts
│   ├── bcrypt.adapter.ts
│   └── regular-exp.ts
│
└── app.ts          (Punto de entrada)
```

### **Flujo de una Solicitud**

```
Solicitud HTTP
    ↓
Routes (Enrutamiento)
    ↓
Controller (Orquestación)
    ↓
DTO.create() (Validación)
    ↓
Service (Lógica de negocio)
    ↓
Repository/Model (Acceso a datos)
    ↓
Entity (Transformación de respuesta)
    ↓
Response JSON
```

---

## 🎯 Patrones de Diseño

### 1. **DTO Pattern (Data Transfer Object)**

Los DTOs validan y transforman datos de entrada:

```typescript
static create(object): [string?, RegisterUserDto?] {
  const { name, email, password } = object;
  if (!name) return ['Missing name'];
  return [undefined!, new RegisterUserDto(name, email, password)];
}
```

### 2. **Service Layer Pattern**

Los servicios encapsulan toda la lógica de negocio:

```typescript
export class AuthService {
  public async registerUser(registerUserDto: RegisterUserDto): Promise<UserAuthData> {
    // Lógica de negocio aquí
  }
}
```

### 3. **Dependency Injection**

Los servicios se inyectan en los controladores:

```typescript
const authService = new AuthService(emailService);
const controller = new AuthController(authService);
```

### 4. **Custom Error Handling**

Errores centralizados con códigos HTTP:

```typescript
throw CustomError.badRequest('Email already exists');
throw CustomError.unauthorized('Invalid credentials');
```

### 5. **Entity Pattern**

Transformación de modelos Mongoose a entidades:

```typescript
const { password, ...userEntity } = UserEntity.fromObject(user);
```

### 6. **Adapter Pattern**

Adaptadores para servicios externos (JWT, Bcrypt):

```typescript
const token = await JwtAdapter.generateToken({ id: user.id });
const hashedPassword = bcryptAdapter.hash(password);
```

---

## 💻 Stack Tecnológico

| Componente        | Tecnología  | Versión |
| ----------------- | ----------- | ------- |
| **Runtime**       | Node.js     | -       |
| **Lenguaje**      | TypeScript  | 5.9.3   |
| **Framework Web** | Express.js  | 5.2.1   |
| **Base de Datos** | MongoDB     | -       |
| **ODM**           | Mongoose    | 9.3.1   |
| **Autenticación** | JWT         | 9.0.3   |
| **Hashing**       | Bcryptjs    | 3.0.3   |
| **Email**         | Nodemailer  | 8.0.3   |
| **Configuración** | dotenv      | 17.3.1  |
| **Desarrollo**    | ts-node-dev | 2.0.0   |

---

## 📁 Estructura del Proyecto

```
express-shell/
├── src/
│   ├── presentation/        # Capa de API REST
│   │   ├── auth/           # Módulo de autenticación
│   │   │   ├── controller.ts
│   │   │   └── routes.ts
│   │   ├── category/       # Módulo de categorías
│   │   │   ├── controller.ts
│   │   │   └── routes.ts
│   │   ├── middlewares/    # Middlewares (JWT, etc)
│   │   ├── services/       # Servicios de negocio
│   │   ├── routes.ts       # Enrutador principal
│   │   └── server.ts       # Configuración de Express
│   │
│   ├── domain/             # Lógica de dominio puro
│   │   ├── dtos/          # DTOs para validación
│   │   ├── entities/      # Entidades del negocio
│   │   └── errors/        # Errores personalizados
│   │
│   ├── data/              # Acceso a datos
│   │   └── mongo/
│   │       ├── mongo-database.ts
│   │       └── models/
│   │
│   ├── config/            # Configuración
│   │   ├── envs.ts
│   │   ├── jwt.adapter.ts
│   │   ├── bcrypt.adapter.ts
│   │   └── regular-exp.ts
│   │
│   └── app.ts            # Punto de entrada
│
├── public/                # Archivos estáticos
├── mongo/                 # Datos de MongoDB (Docker)
├── docker-compose.yml     # Configuración de MongoDB
├── tsconfig.json         # Configuración TypeScript
├── package.json          # Dependencias y scripts
└── README.md            # Este archivo
```

---

## 🚀 Instalación y Setup

### Requisitos Previos

- Node.js (v18+)
- npm o yarn
- Docker (para MongoDB)

### Pasos de Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <repo-url>
   cd express-shell
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.template .env
   ```

   Completa los valores necesarios en `.env`

4. **Iniciar MongoDB con Docker**

   ```bash
   docker compose up -d
   ```

5. **Ejecutar en modo desarrollo**

   ```bash
   npm run dev
   ```

   Deberías ver: `Server running on port {PORT}`

---

## 📦 Comandos Disponibles

```bash
# Desarrollo con hot reload
npm run dev

# Compilar TypeScript a JavaScript
npm run build

# Compilar y ejecutar en producción
npm start
```

---

## 🔌 API Endpoints

### **Autenticación**

#### Registrar Usuario

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan",
  "email": "juan@example.com",
  "password": "secure123"
}
```

**Respuesta (200)**

```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Juan",
    "email": "juan@example.com",
    "emailValidated": false,
    "role": ["user"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "secure123"
}
```

#### Validar Email

```http
GET /api/auth/validate-email/:token
```

### **Categorías**

#### Obtener Categorías

```http
GET /api/categories
```

#### Crear Categoría (Requiere Auth)

```http
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Eletronic products"
}
```

---

## 🔐 Autenticación

El proyecto utiliza **JWT (JSON Web Tokens)** para autenticación:

1. El usuario se registra o inicia sesión
2. Se genera un JWT válido por tiempo determinado
3. En cada solicitud protegida, incluir: `Authorization: Bearer <token>`
4. El middleware `AuthMiddleware.validateJWT` valida el token

---

## 🛑 Manejo de Errores

El proyecto implementa manejo centralizado de errores:

```typescript
// En controllers
this.authService
  .registerUser(registerUserDto!)
  .then(user => res.json(user))
  .catch(error => this.handlerError(error, res));

// Errores personalizados
{
  "error": "Email already exists"  // statusCode: 400
}
```

---

## 📚 Recursos Adicionales

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

## 📄 Licencia

ISC
