# BookStore RESTful API Backend

> High-performance, scalable E-Commerce RESTful API built with Node.js, Express, TypeScript, MongoDB, and Redis. Features Cursor-based Pagination, Mongoose Session Transactions with Optimistic Locking, VNPay Payment Gateway, and BullMQ Background Workers.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

---

## Key Highlights & Architectural Decisions

- **ACID Transaction Safety**: Complete Mongoose Session Transactions for order processing to guarantee **zero overselling** and data consistency across Cart, Inventory, and Order collections.
- **Optimistic Locking**: Implemented `{ quantity: { $gte: buyQty } }` query constraints to safely update product stock concurrently under high load.
- **Cursor-based Pagination**: Replaced traditional offset pagination with Cursor-based strategy (`_id: { $lt: cursor }`) for ultra-fast product listing and order history retrieval (`< 5ms` query time).
- **Security & Authorization**: Dual JWT Token mechanism (AccessToken + HttpOnly RefreshToken Cookie). Strict Role-Based Access Control (RBAC) middleware for `Admin` and `SuperAdmin`.
- **Payment Integration**: Native integration with **VNPay Payment Gateway**, supporting secure URL generation and Server-to-Server IPN (Instant Payment Notification) Webhooks.
- **Asynchronous Workers**: Integrated **BullMQ + Redis** for asynchronous background jobs (Email notifications & Payment timeout cleanup).

---

## Tech Stack & Tools

| Component | Technology |
| :--- | :--- |
| **Language** | TypeScript (Strict Mode) |
| **Runtime & Framework** | Node.js, Express v5 |
| **Database & ODM** | MongoDB, Mongoose v9 |
| **Caching & Queue** | Redis (ioredis), BullMQ |
| **Authentication** | JWT (jsonwebtoken), bcrypt, Cookie-parser |
| **Media Storage** | Cloudinary API + Multer |
| **Validation** | Joi |
| **Payment Gateway** | VNPay SDK |
| **Development Tools** | `tsx` (Hot-reload), Nodemon, Prettier |

---

## System Architecture & Folder Structure

```text
src/
├── @types/          # Custom TypeScript Type Definitions
├── config/          # Environment & Database Configurations
├── constants/       # Global Enums & Constants (Order Status, Payment Status)
├── controllers/     # HTTP Request Handlers (Client & Admin)
├── middlewares/     # Auth, RBAC, Error Converter & Handler
├── models/          # Mongoose Schemas (User, Product, Order, Review, etc.)
├── routes/          # RESTful Express Routes (Client & Admin API Versioning)
├── services/        # Core Business Logic & Database Transactions
├── utils/           # Helper functions (ApiError, catchAsync, JWT, Tree Helper)
├── validates/       # Joi Request Validation Schemas
└── server.ts        # Express Application Entry Point