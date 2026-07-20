# OBE-MS Backend - Outcome-Based Education Management System

## 📋 Project Overview

The **Outcome-Based Education Management System (OBE-MS)** is an enterprise-grade backend microservices architecture designed to manage educational outcomes, learning objectives, and comprehensive educational metrics for academic institutions.

### **Key Objectives**
- Track student learning outcomes and course objectives
- Map educational outcomes to assessment methods
- Generate comprehensive reports on educational effectiveness
- Manage user authentication and multi-tenant support
- Ensure scalability and high availability through microservices

---

## 🏗️ System Architecture

### **Architecture Overview**

```
┌─────────────────────────────────────────────────────────────────┐
│                     Angular Frontend (Port 4200)                │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                      HTTP/REST (JSON)
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│            API Gateway (Port 8080)                              │
│            - Request Routing & Load Balancing                  │
│            - Spring Cloud Gateway                              │
└──────────────────┬──────────────────────────────────────────────┘
                   │
        ┌──────────┼──────────┬──────────┐
        │          │          │          │
        ▼          ▼          ▼          ▼
    ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
    │ Auth   │ │ Core   │ │ Discov.│ │ Other  │
    │Service │ │Service │ │ Server │ │Services│
    └────────┘ └────────┘ └────────┘ └────────┘
        │          │          │
        └──────────┼──────────┘
                   │
        ┌──────────▼──────────┐
        │  Service Registry   │
        │  (Eureka Server)    │
        │  (Port 8761)        │
        └─────────────────────┘
                   │
        ┌──────────▼──────────┐
        │   MySQL Database    │
        │   - User data       │
        │   - OBE Mappings    │
        │   - Outcomes        │
        │   - Reports         │
        └─────────────────────┘
```

---

## 🔧 Backend Services

### **1. Discovery Server (Service Registry)**
**Port:** `8761`  
**Purpose:** Central service discovery and registration using Eureka  
**Location:** `backend/Discovery/`

#### Key Responsibilities:
- Maintains registry of all running microservices
- Enables dynamic service discovery
- Provides health check monitoring
- Supports load balancing

#### Technologies:
- Spring Cloud Netflix Eureka Server
- Spring Boot 3.3.4
- Java 17

#### Configuration:
```yaml
server.port=8761
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
```

#### Start Command:
```bash
cd backend/Discovery
./mvnw spring-boot:run
# OR
mvn spring-boot:run
```

---

### **2. API Gateway (Main Entry Point)**
**Port:** `8080`  
**Purpose:** Single entry point for all client requests  
**Location:** `backend/Api-Gateway/`

#### Key Responsibilities:
- Routes requests to appropriate microservices
- Implements request/response filtering
- Handles global cross-cutting concerns
- Load balancing and failover
- Request/response transformation
- CORS handling

#### Technologies:
- Spring Cloud Gateway (Reactive)
- Eureka Client for service discovery
- Spring Boot 3.3.4
- Project Reactor (non-blocking I/O)

#### Route Configuration:
```
/auth/** → obe-auth-service
/core/** → Core Service
/api/** → Various microservices
```

#### Start Command:
```bash
cd backend/Api-Gateway
./mvnw spring-boot:run
```

#### Check Gateway Health:
```bash
curl http://localhost:8080/actuator/gateway/routes
```

---

### **3. OBE Auth Service (Authentication & User Management)**
**Port:** `8081` (registered with Eureka as "obe-auth-service")  
**Purpose:** Handle user authentication, authorization, and account management  
**Location:** `backend/objectbasedoutcome/`

#### Key Responsibilities:
- User registration and authentication
- JWT token generation and validation
- Password reset and email verification
- Role-based access control (RBAC)
- Multi-tenant user management
- Email service integration
- Flyway database migrations

#### Technologies:
- Spring Boot 3.3.4
- Spring Security with JWT (jjwt 0.11.5)
- JPA/Hibernate with MySQL
- Flyway for database versioning
- Mail Spring Starter
- Jasper Reports (for PDF generation)
- Eureka Client

#### Database Tables:
- `users` - User accounts and credentials
- `roles` - User roles
- `permissions` - Fine-grained permissions
- `user_tenants` - Multi-tenant mappings
- `password_reset_tokens` - Token management
- `audit_logs` - Authentication audit trail

#### API Endpoints:
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - User login
POST   /api/auth/refresh           - Refresh JWT token
POST   /api/auth/logout            - User logout
POST   /api/auth/forgot-password   - Initiate password reset
PUT    /api/auth/reset-password    - Complete password reset
GET    /api/auth/verify-email      - Email verification
GET    /api/users/{id}             - Get user profile
PUT    /api/users/{id}             - Update user profile
GET    /api/users                  - List users (admin)
DELETE /api/users/{id}             - Delete user (admin)
```

#### Start Command:
```bash
cd backend/objectbasedoutcome
./mvnw spring-boot:run
```

---

### **4. Core Service (Business Logic & Data Models)**
**Port:** `8082` (registered with Eureka as "core-service")  
**Purpose:** Shared business logic, data models, and domain operations  
**Location:** `backend/Core/`

#### Key Responsibilities:
- Course and learning outcomes management
- Program outcomes definition
- Course outcome mapping
- Assessment methods and tools
- Report generation
- Data validation and transformation
- Shared entity models

#### Technologies:
- Spring Boot 3.3.4
- Spring Data JPA
- MySQL Driver
- Feign for inter-service communication
- Resilience4j for fault tolerance
- OpenAPI/Swagger for documentation

#### Database Tables:
- `courses` - Course information
- `program_outcomes` - Learning outcomes
- `course_outcomes` - Course-level objectives
- `assessments` - Assessment methods
- `student_results` - Assessment results
- `reports` - Generated reports
- `mappings` - Outcome to assessment mappings

#### Core Entities:
```java
Course
├── id
├── code
├── name
├── description
└── programOutcomes (List)

ProgramOutcome
├── id
├── name
├── description
└── assessments (List)

CourseOutcome
├── id
├── course
├── outcome
└── assessmentMethods

Assessment
├── id
├── name
├── type (Exam, Project, etc.)
└── rubric
```

#### API Endpoints (Examples):
```
GET    /api/core/courses                     - List all courses
POST   /api/core/courses                     - Create course
PUT    /api/core/courses/{id}                - Update course
DELETE /api/core/courses/{id}                - Delete course

GET    /api/core/outcomes                    - List program outcomes
POST   /api/core/outcomes                    - Create outcome
GET    /api/core/outcomes/{id}/assessments   - Get assessments

POST   /api/core/mappings                    - Map outcome to assessment
GET    /api/core/reports/effectiveness       - Generate reports
```

#### Start Command:
```bash
cd backend/Core
./mvnw spring-boot:run
```

---

## 📦 Technology Stack

### **Framework & Platform**
- **Java Version:** 17
- **Spring Boot:** 3.3.4
- **Spring Cloud:** 2023.0.3 (Eureka, Gateway, Feign, OpenFeign)

### **Database**
- **Primary:** MySQL 8.0+
- **ORM:** Spring Data JPA / Hibernate
- **Migration Tool:** Flyway
- **Connection Pooling:** HikariCP (bundled with Spring Boot)

### **Security**
- **Authentication:** JWT (jjwt 0.11.5)
- **Authorization:** Spring Security
- **OAuth2:** Spring Security OAuth2 Client

### **Communication**
- **Inter-service:** OpenFeign (HTTP client)
- **API Documentation:** SpringDoc OpenAPI (Swagger UI 2.5.0)
- **Service Discovery:** Eureka (Netflix OSS)
- **Resilience:** Resilience4j (Circuit Breaker, Retry, Timeout)

### **Additional Libraries**
- **Lombok:** Reduce boilerplate code
- **Jasper Reports:** PDF generation
- **DynamicJasper:** Dynamic report creation
- **jsoup:** HTML parsing and manipulation

---

## 🚀 Prerequisites & Setup

### **System Requirements**
- **OS:** Windows, Linux, or macOS
- **Java:** JDK 17 or higher
- **Maven:** 3.8.0 or higher (or use bundled `mvnw`)
- **MySQL:** 8.0 or higher
- **RAM:** Minimum 4GB (8GB recommended)

### **Installation Steps**

#### **Step 1: Clone/Setup Database**
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE obe_ms;
USE obe_ms;
```

#### **Step 2: Configure Environment Variables**
Create `.env` or `application-dev.yml` in each service:

```yaml
# backend/Discovery/src/main/resources/application.yml
server.port=8761
spring.application.name=discovery-server
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false

# backend/Api-Gateway/src/main/resources/application.yml
server.port=8080
spring.application.name=api-gateway
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/

# backend/objectbasedoutcome/src/main/resources/application.yml
server.port=8081
spring.application.name=obe-auth-service
spring.datasource.url=jdbc:mysql://localhost:3306/obe_ms
spring.datasource.username=root
spring.datasource.password=your_password
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/

# backend/Core/src/main/resources/application.yml
server.port=8082
spring.application.name=core-service
spring.datasource.url=jdbc:mysql://localhost:3306/obe_ms
spring.datasource.username=root
spring.datasource.password=your_password
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

---

## 🏃 Running the Application

### **Option 1: Run Services Individually**

**Terminal 1 - Start Discovery Server:**
```bash
cd backend/Discovery
./mvnw spring-boot:run
# Eureka Dashboard: http://localhost:8761
```

**Terminal 2 - Start API Gateway:**
```bash
cd backend/Api-Gateway
./mvnw spring-boot:run
# Gateway: http://localhost:8080
```

**Terminal 3 - Start Auth Service:**
```bash
cd backend/objectbasedoutcome
./mvnw spring-boot:run
# Auth Service: http://localhost:8081
# Swagger UI: http://localhost:8081/swagger-ui.html
```

**Terminal 4 - Start Core Service:**
```bash
cd backend/Core
./mvnw spring-boot:run
# Core Service: http://localhost:8082
# Swagger UI: http://localhost:8082/swagger-ui.html
```

### **Option 2: Build All Services**
```bash
# Build all backend services
cd backend
./mvnw clean install -DskipTests

# Run individual services
cd Discovery && ./mvnw spring-boot:run &
cd Api-Gateway && ./mvnw spring-boot:run &
cd objectbasedoutcome && ./mvnw spring-boot:run &
cd Core && ./mvnw spring-boot:run &
```

### **Verify Services are Running**
```bash
# Check Eureka Dashboard
curl http://localhost:8761

# Check Gateway Health
curl http://localhost:8080/actuator/health

# Check Auth Service Health
curl http://localhost:8081/actuator/health

# Check Core Service Health
curl http://localhost:8082/actuator/health
```

---

## 🔌 API Communication Flow

### **User Registration & Login Flow**
```
1. Frontend → API Gateway (POST /auth/register)
2. API Gateway → Auth Service (route to obe-auth-service)
3. Auth Service → MySQL (store user data)
4. Auth Service → Flyway (run migrations if needed)
5. Auth Service → Frontend (return JWT token)
```

### **Course Outcome Mapping Flow**
```
1. Frontend → API Gateway (POST /core/mappings)
2. API Gateway → Core Service (route to core-service)
3. Core Service → MySQL (store mapping)
4. Core Service → Reports (generate effectiveness report)
5. Core Service → Frontend (return mapping ID + report)
```

### **Inter-Service Communication**
```
Feign Client: Service A calls Service B
↓
Eureka Discovery: Look up Service B address
↓
Load Balancer: Pick specific instance
↓
Resilience4j: Apply circuit breaker pattern
↓
HTTP Call: Execute request with timeout/retry
```

---

## 📊 Database Design

### **Core Tables**
```sql
-- Users and Authentication
users (id, email, password_hash, first_name, last_name, created_at)
roles (id, role_name, description)
user_roles (user_id, role_id)
permissions (id, permission_name)

-- Tenants & Multi-tenancy
tenants (id, tenant_name, subscription_level)
user_tenants (user_id, tenant_id, role_in_tenant)

-- Educational Outcomes
programs (id, program_name, description)
program_outcomes (id, program_id, outcome_statement, level)
courses (id, course_code, course_name, program_id)
course_outcomes (id, course_id, program_outcome_id)

-- Assessment & Evaluation
assessments (id, assessment_name, assessment_type, rubric)
assessment_methods (id, course_outcome_id, assessment_id)
student_results (id, student_id, assessment_id, score, date)

-- Reporting
reports (id, report_type, generated_by, created_at, file_path)
report_metrics (id, report_id, metric_name, metric_value)

-- Audit & Logging
audit_logs (id, user_id, action, resource_type, timestamp)
password_reset_tokens (id, user_id, token_hash, expires_at)
```

---

## 🔐 Security Implementation

### **Authentication Flow**
```
1. User submits credentials (email + password)
2. Auth Service validates against database
3. Generate JWT token (Header.Payload.Signature)
4. Return token to frontend
5. Frontend includes token in Authorization header
6. API Gateway validates token signature
7. Pass authenticated request to microservice
```

### **JWT Token Structure**
```json
{
  "Header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "Payload": {
    "sub": "user_id",
    "email": "user@example.com",
    "roles": ["STUDENT", "ADMIN"],
    "tenant_id": "123",
    "iat": 1234567890,
    "exp": 1234571490
  },
  "Signature": "HMAC_SHA256(...)"
}
```

### **Multi-Tenant Isolation**
- Each tenant has isolated data
- Queries automatically filtered by tenant_id
- JWT includes tenant context
- API Gateway enforces tenant boundaries

---

## ⚙️ Configuration & Customization

### **Service Port Configuration**
```
Discovery Server    → 8761
API Gateway         → 8080
Auth Service        → 8081
Core Service        → 8082
```

### **Database Configuration**
Located in `src/main/resources/application.yml` for each service:
```yaml
spring.datasource.url=jdbc:mysql://localhost:3306/obe_ms
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

### **Enable Swagger/OpenAPI Documentation**
- Auth Service: http://localhost:8081/swagger-ui.html
- Core Service: http://localhost:8082/swagger-ui.html
- Gateway Docs: http://localhost:8080/swagger-ui.html

---

## 🐛 Troubleshooting

### **Service Not Registering with Eureka**
```bash
# Check application.yml has correct Eureka URL
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/

# Check service name is set
spring.application.name=obe-auth-service
```

### **Connection Refused on Port 8761**
```bash
# Ensure Discovery Server is running first
# Check if port is already in use
netstat -ano | findstr :8761  # Windows
lsof -i :8761                # Mac/Linux
```

### **Database Connection Error**
```bash
# Verify MySQL is running
mysql -u root -p

# Check credentials in application.yml
# Verify database exists
SHOW DATABASES;
```

### **JWT Token Expiration**
- Default expiration: 1 hour
- Refresh token endpoint: POST `/api/auth/refresh`
- Configure in Auth Service: `jwt.expiration=3600000`

---

## 📈 Scaling & Performance

### **Horizontal Scaling**
- Each microservice can run on separate servers
- Eureka handles dynamic registration
- API Gateway distributes load
- Database replication for read scaling

### **Caching Strategy**
- Redis cache for frequently accessed data
- JWT tokens cached on client side
- Course/outcome mappings cached

### **Database Optimization**
- Indexes on `user_id`, `course_id`, `tenant_id`
- Pagination for large result sets
- Connection pooling (HikariCP)

---

## 📚 API Documentation

### **Swagger/OpenAPI Endpoints**
- **Auth Service Docs:** http://localhost:8081/swagger-ui.html
- **Core Service Docs:** http://localhost:8082/swagger-ui.html
- **OpenAPI JSON:** http://localhost:8081/v3/api-docs

### **Example Requests**

**Register User:**
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@university.edu",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@university.edu",
    "password": "SecurePass123!"
  }'
```

**Create Course:**
```bash
curl -X POST http://localhost:8080/core/courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "courseCode": "CS101",
    "courseName": "Introduction to Computer Science",
    "description": "Foundational CS concepts"
  }'
```

---

## 🔄 Deployment

### **Docker Deployment** (Optional)
Create `Dockerfile` for each service:
```dockerfile
FROM openjdk:17-slim
COPY target/api-gateway-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### **Docker Compose** (Optional)
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8
    ports: ["3306:3306"]
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: obe_ms

  discovery:
    build: ./Discovery
    ports: ["8761:8761"]

  gateway:
    build: ./Api-Gateway
    ports: ["8080:8080"]
    depends_on: [discovery]

  auth:
    build: ./objectbasedoutcome
    ports: ["8081:8081"]
    depends_on: [discovery, mysql]

  core:
    build: ./Core
    ports: ["8082:8082"]
    depends_on: [discovery, mysql]
```

---

## 📞 Support & Contact

For questions, issues, or contributions:
- **Repository:** [GitHub - OBE-MS](https://github.com/your-repo)
- **Issues:** [GitHub Issues](https://github.com/your-repo/issues)
- **Documentation:** See `/docs/Architecture.md`

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

---

## 📚 Complete Documentation Index

### **Project Vision & Design**
- **[System Vision & Complete Design](../SYSTEM_VISION_AND_DESIGN.md)** - Future vision, complete system architecture, data models, scalability roadmap
- **[Frontend Architecture (Detailed)](../FRONTEND_ARCHITECTURE_DETAILED.md)** - Comprehensive frontend design with Signals, state management, and implementation patterns
- **[Optimization & Best Practices](../OPTIMIZATION_AND_BEST_PRACTICES.md)** - Backend/frontend optimization, caching strategies, security, and deployment

### **Backend Service Documentation**
- **[Discovery Server README](./Discovery/README.md)** - Service registry using Eureka
- **[API Gateway README](./Api-Gateway/README.md)** - Request routing and cross-cutting concerns
- **[Auth Service README](./objectbasedoutcome/README.md)** - Authentication, JWT, user management
- **[Core Service README](./Core/README.md)** - Business logic, OBE data models, assessments

---

**Last Updated:** 2026 | **Version:** 1.0.0 | **Status:** Production Ready
