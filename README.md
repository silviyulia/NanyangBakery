**SYSTEM MANAGEMENT OPERATIONAL BAKERY & BEVERAGE SHOP WITH MONITORING DASHBOARD**

_Nama Anggota :_

- Silvi yulia rahmawati : 3312411035
- Riska safitri : 3312411056

# 🍞 Nanyang Bakery POS System

## 📖 About The Project

**Nanyang Bakery POS System** is a web-based operational management system developed for a bakery and beverage shop. The system integrates order management, cashier transactions, production, inventory, employee management, and real-time business monitoring into a single platform.

This application was developed as a **Project-Based Learning (PBL)** project to improve the efficiency of bakery operations and support faster decision-making through a real-time dashboard.

---

## ✨ Main Features

### 👑 Owner

- Real-time business monitoring dashboard
- Real-time order monitoring
- Sales reports with period filters
- Export reports to PDF and Excel
- Product & menu management
- Daily production management
- Inventory (raw material) management
- Product recipe management
- Employee management

### 💰 Cashier

- View incoming orders in real time
- Process customer transactions
- Support Cash, QRIS, and Bank Transfer payments
- Transaction history
- Download transaction receipts (PDF)

### 🧑‍🍳 Waiters

- View available menu
- Select customer table
- Create customer orders
- Shopping cart
- Send orders directly to cashier in real time

---

## 📊 System Modules

- Authentication & Role-based Access
- Dashboard Monitoring
- Order Management
- Transaction Management
- Product Management
- Production Management
- Inventory Management
- Recipe Management
- Employee Management
- Sales Report
- Receipt Generation

---

## 🛠️ Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Flowbite React

### Backend

- Laravel 12
- PHP 8.2
- REST API

### Database

- MySQL

### Third-Party Libraries

- Midtrans Payment Gateway
- Laravel DomPDF
- Axios
- Recharts
- XLSX
- jsPDF

---

## 📋 Prerequisites

Before running this project, make sure the following software is installed:

- Git
- Node.js (v20 or later)
- npm
- PHP 8.2 or later
- Composer
- MySQL
- XAMPP or Laragon (optional)

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/silviyulia/NanyangBakery.git
cd NanyangBakery
```

### Backend

```bash
cd backend

composer install

cp .env.example .env

php artisan key:generate
```

Configure your database connection inside `.env`.

```bash
php artisan migrate --seed

php artisan serve
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## 🗄️ Database Configuration

Configure your database connection inside the `.env` file.

Example:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dbnanyang
DB_USERNAME=root
DB_PASSWORD=
```

Run the database migration and seed the default data:

```bash
php artisan migrate --seed
```

---

## Application URL after installation

_Frontend_

http://localhost:3000

_Backend_

http://127.0.0.1:8000

---

## 🔑 Default Accounts

After running the database seeder, you can log in using the following accounts:

| Role    | Email             | Password   |
| ------- | ----------------- | ---------- |
| Owner   | owner@gmail.com   | owner123   |
| Cashier | kasir@gmail.com   | kasir123   |
| Waiter  | waitres@gmail.com | waitres123 |

---

## 💳 Payment Gateway

The application integrates with **Midtrans Sandbox** for online payment simulation.

Required environment variables:

```env
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false
```

---

## 📸 Application Pages

### Owner

- Login
- Dashboard Monitoring
- Real-time Orders
- Sales Reports
- Product & Menu
- Daily Production
- Inventory
- Product Recipes
- Employee Management

### Cashier

- Dashboard
- Transaction
- Transaction History

### Waiters

- Dashboard
- Order Menu

---

## 👥 Development Team

This project was developed by **IF-4MA-11** as part of the **Project-Based Learning (PBL)** course at **Politeknik Negeri Batam**.

---

## 📄 License

This project is intended for educational and research purposes.
