# 📚 BookStore RESTful API Backend

> High-performance, scalable E-Commerce RESTful API built with Node.js, Express, TypeScript, MongoDB, and Redis. Features Cursor-based Pagination, Mongoose Session Transactions with Optimistic Locking, VNPay Payment Gateway, and BullMQ Background Workers.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

---

## 🚀 Key Highlights & Architectural Decisions

- **ACID Transaction Safety**: Complete Mongoose Session Transactions for order processing to guarantee zero overselling and data consistency across Cart, Inventory, and Order collections.
- **Optimistic Locking**: Implemented query constraints to safely update product stock concurrently under high load.
- **Cursor-based Pagination**: Replaced traditional offset pagination with Cursor-based strategy for ultra-fast product listing and order history retrieval (under 5ms query time).
- **Security & Authorization**: Dual JWT Token mechanism (AccessToken and HttpOnly RefreshToken Cookie). Strict Role-Based Access Control (RBAC) middleware for Admin and SuperAdmin roles.
- **Payment Integration**: Native integration with VNPay Payment Gateway, supporting secure URL generation and Server-to-Server IPN (Instant Payment Notification) Webhooks.
- **Asynchronous Workers**: Integrated BullMQ and Redis for asynchronous background jobs (Email notifications and Payment timeout cleanup).

---

## 🛠 Tech Stack & Tools

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
| **Development Tools** | tsx (Hot-reload), Nodemon, Prettier |

---

## 📦 System Architecture & Folder Structure

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
```

---

## 🌐 API Reference

### 🔐 Authentication (/api/v1/auth)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | /auth/send-otp | Public | Send OTP email verification |
| POST | /auth/verify | Public | Verify OTP code |
| POST | /auth/register | Public | Register new customer account |
| POST | /auth/login | Public | Authenticate user & issue tokens |
| GET | /auth/me | User | Get current profile |
| POST | /auth/refresh-token | Public | Obtain new Access Token via Cookie |
| POST | /auth/logout | User | Clear refresh token & logout |

### 📚 Catalog & Storefront (/api/v1)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| GET | /products | Public | Fetch products with Cursor Pagination & Filter |
| GET | /products/:slug | Public | Get product details by slug |
| GET | /categories | Public | Get category tree structure |
| GET | /authors | Public | Get list of book authors |
| GET | /series | Public | Get book series |
| GET | /banners | Public | Get homepage promotion banners |

### 🛒 Shopping Cart & Addresses (/api/v1)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| GET | /cart | User | View shopping cart items |
| POST | /cart | User | Add item to shopping cart |
| PATCH | /cart/:itemId | User | Update cart item quantity |
| DELETE | /cart/:itemId | User | Remove single item from cart |
| DELETE | /cart | User | Clear entire shopping cart |
| GET | /address | User | Get user's shipping addresses |
| POST | /address | User | Create new shipping address |
| PATCH | /address/:id/default | User | Set address as primary default |

### 📦 Order Processing & Payment (/api/v1)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | /orders | User | Checkout & Create Order (Transaction Safe) |
| GET | /orders | User | Get my order history (Cursor Pagination) |
| GET | /orders/:id | User | View single order detail |
| PATCH | /orders/:id/cancel | User | Cancel pending order & restock inventory |
| POST | /payment/create-vnpay-url | User | Generate VNPay payment link |
| GET | /payment/vnpay-return | Public | VNPay client return callback |
| GET | /payment/vnpay-ipn | Public | VNPay server-to-server IPN webhook |

---

## ⚙️ Environment Variables Setup

Create a .env file in the root directory:

```env
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:5173

# Database & Cache
MONGO_URI=mongodb://localhost:27017/book-store
REDIS_URL=redis://localhost:6379

# Security
JWT_ACCESS_SECRET=your_access_token_secret_key_here
JWT_REFRESH_SECRET=your_refresh_token_secret_key_here
ACCESS_TOKEN_EXPIRESIN=15m
REFRESH_TOKEN_EXPIRESIN=15d
SALT_ROUNDS=10

# Media Upload
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# VNPay Payment Sandbox
VNP_TMN_CODE=your_tmn_code
VNP_HASH_SECRET=your_hash_secret
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=http://localhost:5173/payment/vnpay-return
```

---

## 🛠 Local Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DangVanHoaaa/Book-Store.git
   cd Book-Store
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 👤 Author

- **Full Name**: Đặng Văn Hòa
- **Role**: Backend Developer
- **Email**: hoadang13737@gmail.com