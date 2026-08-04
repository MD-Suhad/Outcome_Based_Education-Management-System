# Outcome-Based Education Management System (OBE-MS)
## Master Software Architecture Blueprint & Senior Backend Engineering Laboratory Guide

> **Document Status:** Official Production Architecture & Mentorship Blueprint  
> **Target Audience:** Principal Architects, Lead Engineers, Backend Developers, FAANG Interview Preparation  
> **Methodology:** BMAD (Business, Model, Architecture, Development) & Dual-Purpose Engineering Philosophy  

---

## 1. Executive Summary & Dual-Purpose Philosophy

### 1.1 Dual-Purpose Philosophy

This architecture operates on a strict **Dual-Purpose Mandate**:
1. **Production-Ready Enterprise Platform:** Solve complex real-world university management challenges (curriculum mapping, Outcome-Based Education (OBE) compliance, student outcome measurement, multi-tenant RBAC, accreditation data pipelines).
2. **Senior Software Engineering Laboratory:** Serve as a rigorous hands-on laboratory for mastering enterprise software design, distributed systems, Spring Boot & JVM internals, database scaling, high concurrency, event-driven integration, AI orchestration, and senior-level technical interviews.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   DUAL PURPOSE MANDATE                                  │
├───────────────────────────────────────────┬────────────────────────────────────────────┤
│         GOAL 1: ENTERPRISE PRODUCT        │       GOAL 2: ENGINEERING LABORATORY       │
├───────────────────────────────────────────┼────────────────────────────────────────────┤
│ • Production-grade OBE University Platform │ • JVM Internals & Garbage Collection Tuning│
│ • Multi-tenant RBAC & Security            │ • High-Throughput Distributed System Design│
│ • CO-PO Mapping & Outcome Attainment      │ • Outbox & Saga Patterns for Consistency   │
│ • Accreditation Evidence & Reporting      │ • Advanced Database Indexing & MVCC Locking │
└───────────────────────────────────────────┴────────────────────────────────────────────┘
```

---

## 2. BMAD Master Framework

Every feature in the system strictly adheres to the **BMAD Methodology**:

```
 ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
 │    BUSINESS     │ ────► │      MODEL      │ ────► │  ARCHITECTURE   │ ────► │   DEVELOPMENT   │
 │ Requirements &  │       │ Domain Entities │       │ Microservices & │       │ Production Code │
 │ Value Analysis  │       │ & Aggregates    │       │ Scalability     │       │ & Testing       │
 └─────────────────┘       └─────────────────┘       └─────────────────┘       └─────────────────┘
```

---

## 3. Business Architecture

### 3.1 Core Business Purpose
Universities struggle to measure actual student competency, align syllabus goals with global accreditation standards (such as Washington Accord / ABET / IEB), and produce verifiable proof of outcome attainment. OBE-MS automates the entire lifecycle from outcome definition to continuous quality improvement (CQI).

### 3.2 Primary Stakeholders
- **University Leadership & Deans:** Strategic overview of program performance.
- **Department Heads & Program Coordinators:** Define Program Outcomes (POs) and syllabus alignment.
- **Faculty / Instructors:** Define Course Outcomes (COs), create mapped assessments, and grade student submissions.
- **Students:** Track individual outcome attainment and skill gaps.
- **Accreditation Auditors:** Access transparent, auditable evidence trails.

---

## 4. Domain Architecture & Bounded Contexts

### 4.1 Bounded Contexts Map

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                               BOUNDED CONTEXTS                                  │
├──────────────────────┬──────────────────────┬───────────────────────────────────┤
│ Identity & Auth      │ Academic Structure   │ Outcome & Assessment (OBE Core)   │
│ • User / Account     │ • Department         │ • Program Outcome (PO)            │
│ • Role / Permission  │ • Program            │ • Course Outcome (CO)             │
│ • Tenant (University)│ • Course             │ • Assessment & Rubric             │
│                      │ • Semester / Section │ • Student Result & Attainment     │
└──────────────────────┴──────────────────────┴───────────────────────────────────┘
```

### 4.2 Core Aggregates & Value Objects
- **CourseAggregate:** `Course` (Root), `List<CourseOutcome>`, `Syllabus`.
- **AssessmentAggregate:** `Assessment` (Root), `List<RubricCriterion>`, `CO_Mapping`.
- **AttainmentAggregate:** `StudentAttainment` (Root), `Score`, `CO_Achievement`, `PO_Contribution`.

---

## 5. Enterprise Frontend Architecture (Angular 18+)

### 5.1 Architecture Overview
Built as an enterprise-grade Angular Single Page Application utilizing **Angular Signals** for reactive state management, **Standalone Components**, lazy-loaded feature modules, and dynamic role-based UI generation.

```
frontend/src/app/
├── core/                  # Singleton services, Guards, HTTP Interceptors, Auth
├── shared/                # Reusable UI components (Tables, Dialogs, Charts)
├── layouts/               # Admin Layout, Teacher Layout, Student Layout
└── features/              # Lazy-loaded feature modules
    ├── auth/              # Login, Reset Password
    ├── dashboard/         # Role-based analytics dashboards
    ├── departments/       # Department management
    ├── programs/          # Program & PO management
    ├── courses/           # Course & CO management
    ├── outcomes/          # CO-PO mapping matrix UI
    ├── assessments/       # Assessment setup & Rubrics
    ├── students/          # Student management
    └── results/           # Grading & Outcome attainment reports
```

---

## 6. Enterprise Backend Architecture (Spring Boot 3.3+)

### 6.1 Layered Architecture Strategy
The backend follows a **Modular Monolith transitioning to Microservices**:

```
com.shohaib.obe/
├── api/                   # REST Controllers, Request/Response DTOs, OpenAPI Specs
├── service/               # Business Logic, Transaction Boundaries (@Transactional)
├── domain/                # JPA Entities, Aggregates, Value Objects
├── repository/            # Spring Data JPA Repositories
├── exception/             # Global Exception Handling (@ControllerAdvice)
├── config/                # Security, Redis, RabbitMQ, Swagger configurations
└── client/                # Feign Clients for Inter-Service Communication
```

---

## 7. Database Architecture (PostgreSQL)

### 7.1 Schema Design Principles
- **Relational Integrity:** Foreign keys with explicit index constraints.
- **Partitioning Strategy:** Range partitioning on `student_results` by `academic_year`.
- **Optimistic Locking:** `@Version` annotation on mutable aggregates (`Course`, `Assessment`) to prevent concurrent overwrite.
- **MVCC & Isolation:** Read Committed default, Serializable for critical score updates.

---

## 8. Security Architecture

### 8.1 JWT + Refresh Token Architecture

```
Client              API Gateway / Auth Service             Redis Cache
  │                             │                               │
  ├────── POST /login ────────►│                               │
  │                             ├───── Validate Credentials ───►│
  │                             ├───── Store Refresh Token ────►│
  │◄───── Return Access JWT ────┤                               │
  │       & Refresh Token       │                               │
  │                             │                               │
  ├────── GET /api/courses ────►│                               │
  │       (Bearer JWT)          ├───── Validate JWT Signature   │
  │                             ├───── Check Permissions ───────┤
  │◄───── Return Data ──────────┤                               │
```

---

## 9. Event-Driven & Messaging Architecture (RabbitMQ & Kafka)

### 9.1 Transactional Outbox Pattern
To prevent distributed transaction failures during event publication:

```
┌─────────────────────────────────────────────────────────┐
│                    DATABASE TRANSACTION                 │
├────────────────────────────┬────────────────────────────┤
│ Save Assessment Result     │ Insert into Outbox Table   │
└──────────────┬─────────────┴──────────────┬─────────────┘
               │                            │
               ▼                            ▼
        [results Table]             [outbox_events Table]
                                            │
                                            ▼
                               [Debezium / Poller Service]
                                            │
                                            ▼
                                [RabbitMQ / Kafka Exchange]
```

---

## 10. Realistic AI Architecture

### 10.1 AI Feature Map
1. **Syllabus CO-PO Auto-Alignment:** Uses LLMs to analyze course syllabi and suggest CO-PO mapping weights with confidence scores.
2. **Predictive Outcome Gap Detection:** Uses regression models to predict student failure in reaching target CO attainment before final exams.
3. **Automated Rubric Generator:** Generates multi-tier evaluation rubrics based on Bloom's Taxonomy levels.

---

## 11. Deployment, DevOps & Cloud Architecture

### 11.1 Docker Compose Local Setup
- **App Containers:** API Gateway (8080), Auth Service (8081), Core Service (8082), Discovery (8761), Angular UI (4200).
- **Infrastructure Containers:** PostgreSQL (5432), Redis (6379), RabbitMQ (5672/15672).

---

## 12. Observability & Monitoring

- **Metrics:** Micrometer + Prometheus scraping `/actuator/prometheus`.
- **Dashboards:** Grafana visualizing HTTP latency (p95, p99), JVM heap usage, DB pool connections, and GC pause times.
- **Distributed Tracing:** OpenTelemetry / Micrometer Tracing with Zipkin.

---

## 13. Architecture Decision Records (ADR)

### ADR-001: Selection of PostgreSQL over MySQL
* **Context:** OBE-MS requires JSONB support for dynamic rubric storage, advanced window functions for attainment calculations, and table partitioning.
* **Decision:** Standardize on PostgreSQL.
* **Consequences:** Superior indexing (GIN/GiST for rubrics), robust MVCC handling.

### ADR-002: Modular Monolith to Microservices Transition
* **Context:** Avoid premature microservice complexity during early development.
* **Decision:** Build as a clean Modular Monolith using bounded contexts, then extract microservices (Auth, Core, Analytics) via Spring Cloud Gateway.

---

## 14. 🎓 Senior Backend Engineering Mentorship & Learning Roadmap

*(This section forms the core step-by-step learning syllabus for advancing from Intermediate Java/Spring Developer to Senior Backend Engineer).*

---

### Module 1: Advanced Java Internals & Concurrency

#### 1.1 Java Memory Model & JVM Architecture
- **Concept:** Heap (Young Gen: Eden, Survivor; Old Gen), Metaspace, Stack Frames, Native Memory.
- **Garbage Collection:** G1GC vs ZGC. Understanding Mark-Sweep-Compact, Stop-The-World (STW) pauses.
- **Concurrency & Threads:**
  - `Runnable` vs `Callable<T>` vs `CompletableFuture<T>`.
  - Memory Barriers & `volatile`: Guarantees visibility, prevents instruction reordering, but does NOT guarantee atomicity.
  - Race Conditions & Deadlocks: Four Coffman conditions (Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait).

#### 1.2 Code & Architectural Scenario: Concurrent Score Updating
```java
// Thread-safe atomic counter using CAS (Compare-And-Swap)
public class AttainmentCounter {
    private final AtomicInteger totalSubmissions = new AtomicInteger(0);

    public void increment() {
        totalSubmissions.incrementAndGet(); // Non-blocking lock-free operation
    }
}
```

---

### Module 2: Design Patterns in Enterprise Java

#### 2.1 Pattern Matrix & Spring Boot Internal Usage

| Pattern | Problem Solved | Spring Boot Internal Implementation |
| :--- | :--- | :--- |
| **Singleton** | Ensures single instance per container | Default Spring Bean Scope (`@Component`, `@Service`) |
| **Factory Method** | Encapsulates complex object creation | `BeanFactory`, `FactoryBean<T>` |
| **Proxy** | Adds cross-cutting logic (AOP, Security, Transactions) | JDK Dynamic Proxy / CGLIB Proxy (`@Transactional`, `@Async`) |
| **Observer** | Decouples event producers from listeners | `ApplicationEventPublisher`, `@EventListener` |
| **Strategy** | Swappable algorithms at runtime | `AuthenticationProvider` implementations in Spring Security |
| **Template Method**| Defines execution skeleton, subclasses override steps | `JdbcTemplate`, `RestTemplate`, `TransactionTemplate` |

---

### Module 3: Spring Boot Advanced Internals

#### 3.1 Spring Bean Lifecycle

```
┌───────────────────────────┐
│ Instantiate Bean          │
└─────────────┬─────────────┘
              ▼
┌───────────────────────────┐
│ Populate Properties (DI)  │
└─────────────┬─────────────┘
              ▼
┌───────────────────────────┐
│ BeanNameAware / BeanFactory│
└─────────────┬─────────────┘
              ▼
┌───────────────────────────┐
│ BeanPostProcessor (Pre)   │
└─────────────┬─────────────┘
              ▼
┌───────────────────────────┐
│ @PostConstruct / InitializingBean
└─────────────┬─────────────┘
              ▼
┌───────────────────────────┐
│ BeanPostProcessor (Post)  │ (Proxy creation happens here!)
└─────────────┬─────────────┘
              ▼
┌───────────────────────────┐
│ Bean Ready for Use        │
└───────────────────────────┘
```

---

### Module 4: Database Engineering & Query Optimization

#### 4.1 Indexing Internals: B-Tree vs Hash Indexes
- **B-Tree Index:** O(log N) lookup, range scans (`WHERE score >= 80`).
- **Composite Index Rule:** Leftmost prefix rule. An index on `(department_id, academic_year)` cannot be used efficiently for queries filtering ONLY on `academic_year`.
- **Index Overhead:** Every `INSERT`, `UPDATE`, `DELETE` must update index structures. Excess indexes degrade write throughput.

#### 4.2 Isolation Levels & Concurrency Phenomena

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read | Locking Mechanism |
| :--- | :---: | :---: | :---: | :--- |
| **Read Uncommitted** | Yes | Yes | Yes | None (raw reads) |
| **Read Committed** | No | Yes | Yes | Short-lived read locks |
| **Repeatable Read** | No | No | Yes | Shared locks held till TX end |
| **Serializable** | No | No | No | Range locks / SSI |

---

### Module 5: Distributed Systems & Microservices Patterns

#### 5.1 Resilience Patterns (Resilience4j)
- **Circuit Breaker:** States (Closed → Open → Half-Open). Prevents cascading failures when Auth or Core service degrades.
- **Rate Limiting:** Token Bucket / Leaky Bucket algorithms preventing DDoS.
- **Bulkhead:** Isolates thread pools per service call so one failing downstream endpoint doesn't exhaust all application threads.

---

### Module 6: System Design & FAANG Interview Scenarios

#### 6.1 Senior Engineering Interview FAQ & Scenarios

##### Q1: Why use JWT instead of Session Authentication?
* **Answer:** JWT is stateless and vertically/horizontally scalable across microservices without centralized session storage. Sessions require shared Redis/memcached or sticky sessions on load balancers.
* **Trade-off:** Invalidation of JWT before expiry requires token blacklisting in Redis.

##### Q2: How do you prevent duplicate submission of final exam grades?
* **Answer:** Implement **Idempotency Keys** using Redis.
  1. Client generates UUID key for grading request.
  2. Gateway/Backend checks Redis `SETNX idempotency_key EX 60`.
  3. If key exists, return HTTP 409 Conflict or previous cached response.
  4. If key is new, process transaction inside `@Transactional`.

---

## 15. Development Roadmap & Next Steps

1. **Phase 1:** Core Modular Monolith structure with PostgreSQL & Auth context.
2. **Phase 2:** OBE Domain Aggregates (Course, CO, PO, Assessment, Attainment engine).
3. **Phase 3:** Angular Signals Frontend & Dynamic RBAC layout.
4. **Phase 4:** Event-Driven Outbox with RabbitMQ & Redis Caching Layer.
5. **Phase 5:** AI CO-PO Mapping Assistant & Predictive Analytics.
6. **Phase 6:** Observability Stack (Prometheus, Grafana, Distributed Tracing) & Load Testing.
