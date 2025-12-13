# Sweet Shop Management System

A comprehensive full-stack web application designed to streamline the operations of a boutique sweet shop. This system enables efficient management of inventory (sweets), processes sales transactions via an order system, and provides robust role-based access control for administrators and standard users.

The detailed usage of AI in this project is documented in the [My AI Usage](#my-ai-usage) section.

## Table of Contents
- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Setup and Installation](#setup-and-installation)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
- [Screenshots](#screenshots)
- [Backend Architecture](#backend-architecture)
- [My AI Usage](#my-ai-usage)

## Project Overview
The **Sweet Shop Management System** solves the core challenges of tracking perishable inventory and sales. It provides a secure API for managing sweet products, including their prices, quantities, and categories. Future planned modules include a comprehensive order processing system and detailed inventory logs.

## Technologies Used
- **Frontend**: React, Vite, Framer Motion
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Tools**: VS Code, Git, Postman (for API testing)

## Features
- **User Authentication**: Secure Sign Up and Login/Logout functionality with role-based permissions (Admin vs. User).
- **Inventory Management**:
    - Add, Edit, Delete, and View sweets.
    - Real-time stock quantity adjustments.
- **Search & Filter**: Powerful search capabilities to find sweets by name, or filter by category and price range.
- **Secure API**: Protected endpoints requiring valid authentication tokens.
- **Modern UI/UX**:
    - Responsive glassmorphism design.
    - Smooth animations using Framer Motion.
    - Dedicated Admin Panel for inventory management.

## Setup and Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas URL)

### Backend Setup
1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install functionalities:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    - Create a `.env` file in the `backend` root.
    - Add the following variables (adjust values as needed):
      ```env
      PORT=5000
      MONGO_URI=your_mongodb_connection_string
      JWT_SECRET=your_jwt_secret_key
      ```

4.  **Create Admin User:**
    You must create an initial admin user to access the backend dashboard capabilities. Run the provided script:
    ```bash
    npx ts-node src/scripts/createAdmin.ts
    ```

    **Default Credentials:**
    - **Admin User**:
        - Username: `admin`
        - Password: `password123`
    - **Test User** (created during tests, or register manually):
        - Username: `testuser`
        - Password: `password123`
5.  **Start the Server:**
    - **Development (with hot-reload):**
      ```bash
      npm run dev
      ```
    - **Production:**
      ```bash
      npm start
      ```
    The server should start on `http://localhost:5000`.

### Frontend Setup
1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    The application will typically run on `http://localhost:5173`.

## Running Tests

### Backend Tests
The backend uses **Jest** and **Supertest** for unit and integration testing.

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Run Tests:**
    ```bash
    npm test
    ```

## Screenshots
*User View*
<img width="1941" height="1129" alt="Screenshot 2025-12-13 180244" src="https://github.com/user-attachments/assets/78dafa1f-6d9f-4dab-8b3a-baed23cab1fb" />

*Dashboard View*
<img width="2057" height="1236" alt="Screenshot 2025-12-13 180351" src="https://github.com/user-attachments/assets/bcc0a1b3-1940-4653-998c-738f7e040b61" />
<img width="1534" height="1161" alt="Screenshot 2025-12-13 180402" src="https://github.com/user-attachments/assets/214a4329-d679-43c6-90e3-0b41dc812e1c" />


*Inventory Management*
<img width="1551" height="1157" alt="image" src="https://github.com/user-attachments/assets/e8000a8b-e5c5-465a-bafd-bdf494bcf651" />


## Backend Architecture

The backend is built with Node.js, Express, and MongoDB. Below is an analysis of the implementation status and future planned components.

### Implemented Features

#### 1. User Authentication
- **Secure Access**: `authController` handles user registration and login.
- **JWT Middleware**: `authMiddleware` protects routes using JSON Web Token verification.
- **Role-Based Access**: Specialized middleware (`admin`) exists to restrict sensitive actions to admin users.

#### 2. Sweet Inventory Management
- **CRUD Operations**: `sweetController` provides functionality to Create, Read, Update, and Delete sweets.
- **Search & Filtering**: Endpoints allow filtering by name, category, and price range (`/search`).
- **Basic Stock Control**:
    - `purchaseSweet`: Decrements sweet quantity (Basic logic only, no order record).
    - `restockSweet`: Increments sweet quantity (Admin only).

## My AI Usage

In developing this project, I utilized AI tools to assist with specific aspects of the development process, ensuring that the core logic and implementation remained my own work.

### Tools Used
- **Gemini (Google DeepMind)**: Primary coding assistant for full-stack implementation.
- **ChatGPT**: Used for conceptual understanding and refining documentation.
- **Claude**: Referenced for alternative architectural patterns.

### How I Used Them
I integrated AI into my workflow as a "senior pair programmer" rather than just a code generator.
- **Frontend Scaffolding**: I used Gemini to rapidly set up the React + Vite environment and configure the directory structure.
- **CSS Design System**: The modern "Glassmorphism" theme was implemented efficiently by describing the desired aesthetic to the AI, which generated the complex CSS variables and utility classes.
- **Script Generation**: The `createAdmin.ts` database seeding script was generated by the AI to quickly set up a test environment without manual database insertions.

### Reflection
Using AI significantly accelerated my development velocity. It handled the "boilerplate" heavy lifting—like setting up the Express server, `create-vite`, and basic CRUD forms—allowing me to focus on the business logic and user experience. 

However, it also highlighted the need for careful review. For instance, the initial specific aesthetic requirements (colors, fonts) needed manual tuning and iterative prompting to get "just right." The `isAdmin` bug was a classic example of where AI can help debug, but only if I understand the underlying data model well enough to ask the right questions. Overall, AI acted as a powerful multiplier for my own coding skills, not a replacement.
