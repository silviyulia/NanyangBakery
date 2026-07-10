**SYSTEM MANAGEMENT OPERATIONAL BAKERY & BEVERAGE SHOP WITH MONITORING DASHBOARD**

*Nama Anggota :*
* Silvi yulia rahmawati : 3312411035
* Riska safitri : 3312411056 

# 🍞 Nanyang Bakery POS System

## 📖 About The Project

**Nanyang Bakery POS System** is a web-based operational management system developed for a bakery and beverage shop. The system integrates order management, cashier transactions, production, inventory, employee management, and real-time business monitoring into a single platform.

This application was developed as a **Project-Based Learning (PBL)** project to improve the efficiency of bakery operations and support faster decision-making through a real-time dashboard.

---
## ✨ Main Features

### 👑 Owner

* Real-time business monitoring dashboard
* Real-time order monitoring
* Sales reports with period filters
* Export reports to PDF and Excel
* Product & menu management
* Daily production management
* Inventory (raw material) management
* Product recipe management
* Employee management

### 💰 Cashier

* View incoming orders in real time
* Process customer transactions
* Support Cash, QRIS, and Bank Transfer payments
* Transaction history
* Download transaction receipts (PDF)

### 🧑‍🍳 Waiters

* View available menu
* Select customer table
* Create customer orders
* Shopping cart
* Send orders directly to cashier in real time

---

## 📊 System Modules

* Authentication & Role-based Access
* Dashboard Monitoring
* Order Management
* Transaction Management
* Product Management
* Production Management
* Inventory Management
* Recipe Management
* Employee Management
* Sales Report
* Receipt Generation

---

## 🛠️ Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Flowbite React

### Backend

* Laravel 12
* PHP 8.2
* REST API

### Database

* MySQL

### Third-Party Libraries

* Midtrans Payment Gateway
* Laravel DomPDF
* Axios
* Recharts
* XLSX
* jsPDF

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

php artisan migrate

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

Configure the database connection inside `.env`.

---

## 💳 Payment Gateway

The application integrates with **Midtrans Sandbox** for online payment simulation.

Required environment variables:

```env
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false
```

## 📸 Application Pages

### Owner

* Login
* Dashboard Monitoring
* Real-time Orders
* Sales Reports
* Product & Menu
* Daily Production
* Inventory
* Product Recipes
* Employee Management

### Cashier

* Dashboard
* Transaction
* Transaction History

### Waiters

* Dashboard
* Order Menu


## 👥 Development Team

This project was developed by **IF-4MA-11** as part of the **Project-Based Learning (PBL)** course at **Politeknik Negeri Batam**.

---

## 📄 License

This project is intended for educational and research purposes.
