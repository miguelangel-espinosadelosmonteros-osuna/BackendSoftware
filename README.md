# Backend JWT – API de Tareas

API REST con **Node.js, Express y MongoDB (Mongoose)**. Permite registrar usuarios, iniciar sesión obteniendo un **JWT** y manejar un CRUD de tareas protegido con **Bearer Token**. Cada usuario solo puede ver, modificar y eliminar sus propias tareas.

## Requisitos

- Node.js 18 o superior
- Una base de datos MongoDB (local o Atlas)

## Instalación

```bash
git clone <url-de-este-repo>
cd <carpeta-del-repo>
npm install
```

Copia `.env.example` como `.env` y llena los valores:

```env
NODE_ENV=development
PORT=5000
MONGO_DB=<cadena de conexión de MongoDB>
JWT_SECRET=<secreto largo y aleatorio>
```

## Ejecución

```bash
npm run server   # desarrollo, con nodemon
npm start        # producción
```

La API queda en `http://localhost:5000`.

## Endpoints

| Método | Ruta | Descripción | Token |
|---|---|---|---|
| POST | `/api/users` | Crear usuario (`nombre`, `email`, `password`) | No |
| POST | `/api/users/login` | Iniciar sesión, devuelve el JWT (`email`, `password`) | No |
| GET | `/api/users/datos` | Datos del usuario dueño del token | Sí |
| GET | `/api/tareas` | Listar las tareas del usuario logueado | Sí |
| POST | `/api/tareas` | Crear una tarea (`descripcion`) | Sí |
| PUT | `/api/tareas/:id` | Modificar una tarea propia (`descripcion`) | Sí |
| DELETE | `/api/tareas/:id` | Eliminar una tarea propia | Sí |

Las rutas protegidas requieren el header:

```
Authorization: Bearer <token>
```

## Seguridad

- El middleware `protect` valida el token; sin token o con token inválido responde `401`.
- El id del usuario se toma del token (`req.user.id`), nunca del body ni de la URL.
- Cada tarea guarda el id de su dueño y todas las consultas filtran por ese id; si la tarea no es del usuario se responde `404`.
- Las contraseñas se guardan con hash usando `bcrypt`.
