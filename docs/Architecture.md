# Outcome-Based Education Management System (OBE-MS)
## System Architecture Blueprint

The Outcome-Based Education Management System (OBE-MS) is designed as a high-performance, modular service-oriented system consisting of modern Spring Boot backend microservices and an Angular Single Page Application client.

---

## 1. High-Level Microservices Topology

```mermaid
graph TD
    Client[Angular Frontend Client: Port 4200] -->|HTTPS / REST API| Gateway[Spring Cloud API Gateway: Port 8080]
    Gateway -->|Service Discovery| Discovery[Eureka Discovery Server: Port 8761]
    Gateway -->|JWT Auth & RBAC| AuthService[Auth Service: Port 8081]
    Gateway -->|OBE Core Domain| CoreService[Core Academic Service: Port 8082]
    
    AuthService -->|Auth DB| DB1[(PostgreSQL / MySQL Auth DB)]
    CoreService -->|Core DB| DB2[(PostgreSQL Core DB)]
    
    CoreService -->|Publish Events| RabbitMQ[RabbitMQ Message Broker]
    RabbitMQ -->|Event Stream| Notification[Notification Worker Engine]
    CoreService -->|Cache Attainment| Redis[(Redis Cluster)]
```

---

## 2. Request Processing Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    participant UI as Angular SPA Client
    participant GW as API Gateway (8080)
    participant Auth as Auth Service (8081)
    participant Core as Core Service (8082)
    participant DB as PostgreSQL Core DB
    participant MQ as RabbitMQ Broker

    UI->>GW: POST /api/v1/auth/login
    GW->>Auth: Route to Auth Service
    Auth-->>GW: Return Access JWT & Refresh Token
    GW-->>UI: 200 OK (Tokens)

    UI->>GW: PUT /api/v1/courses/cs-301/copo-matrix (Bearer JWT)
    GW->>GW: Validate JWT Signature & Roles
    GW->>Core: Forward Authorized Request
    Core->>DB: Update CO-PO Correlation Matrix inside @Transactional
    Core->>DB: Write Outbox Event (COPO_MAPPING_UPDATED)
    Core-->>GW: 200 OK
    GW-->>UI: 200 OK (Matrix Updated)

    Note over Core,MQ: Poller process publishes Outbox events asynchronously
    Core->>MQ: Publish COPO_MAPPING_UPDATED to Exchange
```

---

## 3. Backend Microservices Components

### 1. Discovery Server (`Discovery` - `:8761`)
- Dynamic service registry built with **Spring Cloud Netflix Eureka**.
- Allows microservices to dynamically register and discover each other without hardcoded IP addresses or ports.

### 2. API Gateway (`Api-Gateway` - `:8080`)
- Reactive API entry point built on **Spring Cloud Gateway** and **Project Reactor**.
- Responsibilities:
  - Global CORS management.
  - JWT Access Token verification and tenant context injection.
  - Dynamic route matching based on path prefixes (`/api/v1/auth/**` → Auth Service, `/api/v1/**` → Core Service).
  - Rate limiting with Redis sliding window.

### 3. OBE Auth Service (`objectbasedoutcome` - `:8081`)
- Handles identity management, user registration, JWT generation, password resets, and multi-tenant authorization.
- Flyway database migration scripts initialize security schemas.

### 4. Core OBE Service (`Core` - `:8082`)
- Manages key academic aggregates: Departments, Programs, Program Outcomes (POs), Courses, Course Outcomes (COs), CO-PO Mapping Matrix, Assessments, and Rubrics.
- Evaluates student outcome attainment using statistical aggregation engines.

---

## 4. Cross-Cutting Concerns

- **Resilience:** Circuit Breakers and Retry policies powered by Resilience4j prevent service cascade failures.
- **Security:** Standardized Spring Security 6 resource server configuration enforcing fine-grained RBAC permissions (`hasAuthority('ROLE_FACULTY')`).
- **Distributed Tracing:** Micrometer Tracing with OpenTelemetry context propagation across all HTTP and AMQP calls.
