# 🔐 Secure Notes & Knowledge Management API

> A production-oriented backend REST API built with **Java, Spring Boot, Spring Security, JPA/Hibernate, and JWT authentication**, designed around secure user-specific note management.

This project started as a simple Notes CRUD application and has evolved into a **secure, layered backend system** with database-backed authentication, authorization, validation, exception handling, and an ongoing migration from Basic Authentication to **JWT-based stateless authentication**.

The goal is to build the project incrementally toward the architecture and security practices used in modern backend applications.

---

## 🚀 Project Overview

The application provides authenticated users with a secure API for managing their personal notes.

Instead of treating the project as a simple CRUD application, the backend is structured around:

* 🔐 Authentication & authorization
* 👤 User-specific resources
* 🧩 Layered backend architecture
* 🗄️ Persistent data access through JPA/Hibernate
* 🛡️ Secure password storage
* 📦 DTO-based API communication
* ✅ Request validation
* ⚠️ Centralized exception handling
* 📄 Pagination
* 🔑 JWT-based stateless authentication *(currently being implemented)*

---

# 🏗️ Architecture

The application follows a layered architecture that separates responsibilities across different components.

```text
                         ┌─────────────────────┐
                         │       Client        │
                         │ Postman / Frontend  │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Spring Security   │
                         │ Authentication      │
                         │ Authorization       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Controller       │
                         │    REST API         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Service        │
                         │   Business Logic    │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     Repository      │
                         │    Spring Data JPA  │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Database       │
                         │    H2 / SQL DB      │
                         └─────────────────────┘
```

---

# 🔐 Security Architecture

Security is one of the main focuses of this project.

The application uses **Spring Security** to protect API endpoints and authenticate users against credentials stored in the database.

### Current Authentication Flow

```text
User
 │
 │ Username + Password
 ▼
Spring Security
 │
 ▼
CustomUserDetailsService
 │
 ▼
User Repository
 │
 ▼
Database
 │
 ▼
Authenticated User
```

Passwords are never stored as plain text.

They are securely hashed using **BCrypt** before being persisted.

---

# 🔑 JWT Authentication

The project is currently being upgraded from HTTP Basic Authentication to **JWT-based stateless authentication**.

### Target Authentication Flow

```text
             LOGIN
               │
               ▼
      ┌─────────────────┐
      │ Authentication  │
      │    Endpoint     │
      └────────┬────────┘
               │
               ▼
      Verify Username
       & Password
               │
               ▼
      ┌─────────────────┐
      │   JWT Service    │
      └────────┬────────┘
               │
               ▼
          JWT Token
               │
               ▼
             Client
               │
               │ Authorization: Bearer <JWT>
               ▼
      ┌─────────────────┐
      │ JWT Security    │
      │     Filter      │
      └────────┬────────┘
               │
               ▼
        Authenticated
           Request
               │
               ▼
          Controller
```

### JWT Migration Status

* ✅ Spring Security configured
* ✅ Database authentication
* ✅ `CustomUserDetailsService`
* ✅ BCrypt password encoding
* 🔄 JWT authentication implementation
* 🔄 JWT request filtering
* 🔄 Stateless security configuration
* ⏳ Final endpoint authorization testing

---

# 👤 User-Specific Authorization

A major part of the project's security evolution is moving from simply asking:

> "Is this user authenticated?"

to:

> "Does this authenticated user actually own this resource?"

The intended authorization model is:

```text
User A
 ├── Note 1
 ├── Note 2
 └── Note 3

User B
 ├── Note 4
 └── Note 5
```

User A should never be able to read, modify, or delete User B's notes.

This introduces **resource ownership authorization** into the backend.

---

# 📦 Core Features

## Authentication

* User registration
* Database-backed authentication
* BCrypt password hashing
* Spring Security integration
* Custom `UserDetailsService`
* JWT authentication *(in progress)*

## Notes Management

* Create notes
* Retrieve notes
* Retrieve individual notes
* Update notes
* Delete notes
* Pagination

## Backend Engineering

* Layered architecture
* RESTful API design
* DTO-based request handling
* Bean validation
* Centralized exception handling
* JPA/Hibernate persistence
* Dependency Injection

---

# 📁 Project Structure

The project follows a modular Spring Boot structure:

```text
src/
└── main/
    ├── java/
    │   └── ...
    │       ├── controller/
    │       │
    │       ├── service/
    │       │
    │       ├── repository/
    │       │
    │       ├── model/
    │       │
    │       ├── dto/
    │       │
    │       ├── security/
    │       │
    │       ├── exception/
    │       │
    │       └── config/
    │
    └── resources/
        └── application.properties
```

### Controller Layer

Responsible for:

* HTTP endpoints
* Request/response handling
* Input validation
* Delegating operations to services

### Service Layer

Contains:

* Business logic
* Application rules
* Coordination between controllers and repositories
* Authorization-related logic

### Repository Layer

Responsible for:

* Database interaction
* CRUD operations
* Query methods

Implemented using **Spring Data JPA**.

### Model Layer

Contains entities representing the application's persistent data.

### DTO Layer

Separates API request/response models from internal database entities.

### Security Layer

Responsible for:

* Authentication
* JWT processing
* Security filters
* User identity
* Authorization

---

# 🛠️ Technology Stack

| Technology            | Purpose                        |
| --------------------- | ------------------------------ |
| **Java**              | Backend programming            |
| **Spring Boot**       | Application framework          |
| **Spring MVC**        | REST API                       |
| **Spring Security**   | Authentication & authorization |
| **JWT**               | Stateless authentication       |
| **Spring Data JPA**   | Data access                    |
| **Hibernate**         | ORM                            |
| **H2 / SQL Database** | Persistence                    |
| **Maven**             | Build & dependency management  |
| **BCrypt**            | Password hashing               |
| **Git & GitHub**      | Version control                |

---

# 🌐 REST API

The backend exposes RESTful endpoints for authentication and note management.

### Authentication

```http
POST /register
```

Registers a new user.

```http
POST /login
```

Authenticates the user and, as JWT implementation is completed, returns an access token.

---

### Notes

```http
GET /notes
```

Retrieve notes belonging to the authenticated user.

```http
GET /notes/{id}
```

Retrieve a specific note.

```http
POST /notes
```

Create a new note.

```http
PUT /notes/{id}
```

Update an existing note.

```http
DELETE /notes/{id}
```

Delete an existing note.

Protected endpoints require authentication.

---

# 🔄 Request Lifecycle

A typical authenticated request will follow this flow:

```text
HTTP Request
     │
     ▼
Spring Security
     │
     ▼
JWT Filter
     │
     ├── Extract JWT
     │
     ├── Validate JWT
     │
     └── Identify User
     │
     ▼
Security Context
     │
     ▼
Controller
     │
     ▼
Service
     │
     ▼
Repository
     │
     ▼
Database
```

This keeps authentication and authorization concerns separate from the core business logic.

---

# 🧪 Testing

API functionality can be tested using:

* Postman
* IntelliJ HTTP Client
* cURL

Example authenticated request:

```bash
curl -H "Authorization: Bearer <JWT_TOKEN>" \
     http://localhost:8080/notes
```

---

# ▶️ Running Locally

Clone the repository:

```bash
git clone <repository-url>
```

Navigate into the project:

```bash
cd <project-directory>
```

Run the application:

```bash
./mvnw spring-boot:run
```

Or:

```bash
mvn spring-boot:run
```

The API will be available at:

```text
http://localhost:8080
```

---

# 📈 Development Roadmap

### Phase 1 — REST API

* [x] Spring Boot application
* [x] REST controllers
* [x] Notes CRUD
* [x] Service layer
* [x] Repository layer
* [x] JPA/Hibernate
* [x] DTOs
* [x] Validation
* [x] Exception handling
* [x] Pagination

### Phase 2 — Authentication

* [x] User registration
* [x] Database-backed authentication
* [x] Spring Security
* [x] BCrypt password hashing
* [x] Custom UserDetailsService

### Phase 3 — Authorization

* [x] Associate authenticated users with application security context
* [🔄] Associate notes with their owners
* [🔄] Restrict note access to owners
* [ ] Prevent unauthorized updates
* [ ] Prevent unauthorized deletion

### Phase 4 — JWT Security

* [🔄] JWT generation
* [🔄] JWT validation
* [🔄] JWT authentication filter
* [🔄] Stateless session configuration
* [ ] Complete protected endpoint testing
* [ ] Remove dependency on Basic Authentication

### Phase 5 — Production Readiness

* [ ] MySQL/PostgreSQL
* [ ] Role-based authorization
* [ ] Swagger/OpenAPI documentation
* [ ] Unit testing
* [ ] Integration testing
* [ ] Docker
* [ ] CI/CD
* [ ] Deployment

---

# 🎯 Engineering Goals

The primary goal of this project is not simply to build a CRUD application.

It is being developed as a practical backend engineering project to understand how modern Spring Boot applications handle:

```text
Authentication
      ↓
Authorization
      ↓
Business Logic
      ↓
Data Access
      ↓
Persistence
```

The project is intentionally being developed incrementally, with each stage introducing a deeper backend concept.

---

# 📚 Key Concepts Demonstrated

* REST API design
* Spring Boot
* Dependency Injection
* Inversion of Control
* Layered Architecture
* Spring Security
* Authentication
* Authorization
* JWT
* BCrypt
* `UserDetails`
* `UserDetailsService`
* Security Context
* Security Filters
* JPA
* Hibernate
* DTOs
* Validation
* Exception Handling
* Pagination
* Database persistence
* Git/GitHub

---

## 🚧 Project Status

**Active Development**

The project is currently in the transition from **Basic Authentication → JWT-based stateless authentication**, followed by implementation of complete **user-specific note authorization**.

The long-term objective is to evolve the project from a basic CRUD backend into a **secure, production-oriented Spring Boot REST API**.
