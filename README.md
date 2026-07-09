# E-Commerce Backend API

A production-ready RESTful API for an E-Commerce application, built using Node.js, Express.js, and MongoDB (via Mongoose). This project features user authentication, product catalog management, a shopping cart module, and order processing.

---

## Features

### 1. Authentication
- **User Registration**: Secure sign-up with passwords hashed using `bcrypt` (10 salt rounds).
- **User Login**: Validates credentials and returns JSON Web Tokens (JWT) for stateless session handling.
- **Cookie & Header Authentication**: Stores and verifies JWT tokens via secure HTTP-only cookies or Authorization Bearer headers.

### 2. Product Catalog
- Full CRUD operations:
  - `POST /user/product`: Add products (Admin-only recommended, supports name, description, price, stock, category, image).
  - `GET /user/product`: Fetch all products.
  - `PATCH /user/product/:id`: Update specific product information.
  - `DELETE /user/product/:id`: Remove products from catalog.

### 3. Shopping Cart Module
- **Add to Cart (`POST /cart`)**: Adds an item or updates its quantity. Performs database checks to ensure sufficient stock.
- **Get Cart (`GET /cart/:userId`)**: Retrieves the user's cart, using Mongoose `populate()` to append detailed product information.
- **Remove from Cart (`DELETE /cart/:productId`)**: Removes a specific product from the cart.
- **Auto-Calculations**: Automatically updates `totalPrice` based on the database price of the active catalog products on every write.

### 4. Order Management Module
- **Place Order (`POST /order`)**: Processes current cart items, validates product catalog stock, deducts stock numbers, compiles order information, creates the order, and resets/empties the user's cart.
- **Get User Orders (`GET /orders/:userId`)**: Retrieves the order history for the specified user with populated product data.
- **Order Status**: Supports statuses: `Pending`, `Delivered`, and `Cancelled`.

---

## Tech Stack
- **Runtime Environment**: Node.js (v16+)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Security**: JWT (`jsonwebtoken`), Password Hashing (`bcrypt`)
- **Environment Config**: `dotenv`
- **Cookie Parsing**: `cookie-parser`

---

## Folder Structure

```text
Backend/
│
├── src/
│   ├── controllers/
│   │   ├── Cart.Controller.js
│   │   ├── Order.Controller.js
│   │   ├── product.Controller.js
│   │   └── user.controller.js
│   │
│   ├── db/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   └── auth.middleware.js
│   │
│   ├── models/
│   │   ├── Cart.models.js
│   │   ├── Order.models.js
│   │   ├── product.models.js
│   │   └── user.model.js
│   │
│   ├── routers/
│   │   ├── cart.router.js
│   │   ├── order.router.js
│   │   ├── product.router.js
│   │   └── user.router.js
│   │
│   └── app.js
│
├── .env.example
├── package.json
├── server.js
└── README.md
```

---

## API Endpoints

### Authentication
| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/auth/user/register` | `POST` | Registers a new user | No |
| `/auth/user/login` | `POST` | Authenticates user and sets JWT cookie | No |

### Products
| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/user/product` | `POST` | Add a new product | No (or Admin) |
| `/user/product` | `GET` | Retrieve all products | No |
| `/user/product/:id` | `PATCH` | Update a product | No |
| `/user/product/:id` | `DELETE` | Delete a product | No |

### Cart
| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/cart` | `POST` | Add item or update quantity in cart | Yes |
| `/cart/:userId` | `GET` | Fetch user's cart (populated) | Yes |
| `/cart/:productId` | `DELETE`| Remove product from cart | Yes |

### Orders
| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/order` | `POST` | Place an order from active cart | Yes |
| `/orders/:userId` | `GET` | Get all orders of a user | Yes |

---

## Installation Steps

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd E-commerce-backend/Backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `Backend/` directory and populate it according to the template below.

---

## Environment Variables

Create a `.env` file in the root of the `Backend/` folder:

```env
PORT=3000
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_key_here
```

---

## How to Run

### Development Mode
Runs the server with hot-reloading using `nodemon`:
```bash
npm run dev
```

### Production Mode
Runs the server normally:
```bash
node server.js
```

---

## Sample Request Bodies

### 1. User Register (`POST /auth/user/register`)
```json
{
  "username": "johndoe",
  "email": "johndoe@example.com",
  "password": "Password123",
  "role": "customer"
}
```

### 2. User Login (`POST /auth/user/login`)
```json
{
  "email": "johndoe@example.com",
  "password": "Password123"
}
```

### 3. Create Product (`POST /user/product`)
```json
{
  "name": "Sony WH-1000XM4",
  "description": "Industry leading noise canceling wireless headphones",
  "price": 349.99,
  "stock": 50,
  "category": "Electronics",
  "image": "https://example.com/images/sony-headphones.jpg"
}
```

### 4. Add to Cart (`POST /cart`)
```json
{
  "productId": "65b2661d4a8e23f03b29c9ef",
  "quantity": 2
}
```

---
