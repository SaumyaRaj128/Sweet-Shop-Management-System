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

4.  **Compile TypeScript (Optional if running prod):**
    ```bash
    npm run build
    ```

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
*(Note: Frontend directory is currently in development. Instructions below are standard placeholders).*

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
    The application will typically run on `http://localhost:3000` or `http://localhost:5173`.

## Screenshots

> *Add screenshots of your application here correctly. E.g., Login Screen, Dashboard, Inventory List.*

*Placeholder: Dashboard View*
![Dashboard Screenshot](path/to/screenshot1.png)

*Placeholder: Inventory Management*
![Inventory Screenshot](path/to/screenshot2.png)

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
- **ChatGPT**
- **Gemini**
- **Claude**

### How I Used Them
I used these tools primarily as intelligent documentation and for debugging assistance. For example:
- **ChatGPT** helped in refining natural language descriptions and generating boilerplate comments.
- **Gemini** was useful for brainstorming potential API endpoint structures and validating some architectural decisions.
- **Claude** assisted in understanding some complex logic flows and suggesting optimizations for cleaner code.

### Reflection
Using AI tools streamlined my workflow by reducing the time spent on repetitive tasks and looking up syntax. It allowed me to focus more on the logic and design of the Sweet Shop Management System. However, I made sure to review and understand every piece of code suggested to ensure it met the specific requirements of the project. The AI acted more as a pair programmer than a solution generator.