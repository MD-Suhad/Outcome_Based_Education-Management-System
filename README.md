# Outcome-Based Education Management System (OBE-MS)

**A comprehensive, enterprise-grade platform for managing educational outcomes, measuring program effectiveness, and supporting data-driven educational improvements.**

---

## 📖 Quick Navigation

This project contains extensive documentation organized by topic. Choose what you need:

### **🎯 Getting Started & Master Architecture Blueprint**
- **Master Architecture Blueprint & Senior Engineering Roadmap:** [Master Architecture Blueprint](./docs/MASTER_ARCHITECTURE_BLUEPRINT.md) ⭐ *(Staff Architecture Blueprint & Senior Backend Engineering Laboratory Guide)*
- **First time here?** Start with [Project Vision & Design](./SYSTEM_VISION_AND_DESIGN.md) to understand the big picture
- **Want to run it locally?** Go to [Backend Setup Guide](./backend/README.md)
- **Frontend dev?** See [Frontend Architecture](./FRONTEND_ARCHITECTURE_DETAILED.md)

### **📚 Complete Documentation**

| Document | Purpose | Audience |
|----------|---------|----------|
| [Master Architecture Blueprint](./docs/MASTER_ARCHITECTURE_BLUEPRINT.md) | BMAD Framework, Staff System Design, Senior Engineering Mentorship Roadmap | Architects, Senior Engineers |
| [System Vision & Design](./SYSTEM_VISION_AND_DESIGN.md) | Complete system architecture, data models, scalability, roadmap | Architects, Project Managers |
| [Backend README](./backend/README.md) | All backend services overview and setup | Backend Developers |
| [Frontend Architecture](./FRONTEND_ARCHITECTURE_DETAILED.md) | Angular app structure, Signals, state management | Frontend Developers |
| [Optimization Guide](./OPTIMIZATION_AND_BEST_PRACTICES.md) | Performance tuning, security, caching strategies | All Developers |

### **🔧 Enterprise System Architecture Configuration**

| Service / Module | Port | Architecture Responsibility | Key Technologies |
|------------------|------|-----------------------------|------------------|
| **Discovery Server** | `8761` | Dynamic Service Registry & Health Monitoring | Netflix Eureka, Spring Boot 3.3 |
| **API Gateway** | `8080` | Unified Entry Point, Reactive Routing, Load Balancing | Spring Cloud Gateway, Project Reactor |
| **Auth Service** | `8081` | Authentication, RBAC, Multi-Tenant User Management, JWT Tokens | Spring Security, Flyway, MySQL/PostgreSQL |
| **Core Service** | `8082` | Academic Domain, Courses, PO/CO Definitions, Assessments | Spring Data JPA, Hibernate, Resilience4j |
| **Frontend SPA** | `4200` | Angular Single Page Application with Signals & Glassmorphism UI | Angular 19, Angular Material, SCSS, RxJS |

---

## 🚀 Key Feature Modules Architecture

### 1. 🎯 Program Learning Outcomes (PLOs / POs) Module
* **Location:** [frontend/src/app/features/programs](file:///f:/Shohaib/Project/Outcome_Based_Education-Management-System/frontend/src/app/features/programs/program-outcomes.component.ts)
* **Function:** Washington Accord & University PLO definition, Taxonomy Domain classification (Cognitive, Affective, Psychomotor), target vs actual attainment tracking.

### 2. 🧩 CO-PO Matrix Mapping Module
* **Location:** [frontend/src/app/features/outcomes](file:///f:/Shohaib/Project/Outcome_Based_Education-Management-System/frontend/src/app/features/outcomes/copo-mapping.component.ts)
* **Function:** Interactive correlation grid mapping Course Outcomes (CO1-CO4) against PLO-1 to PLO-6 with standard OBE correlation weights (3 = High, 2 = Medium, 1 = Low).

### 3. 📝 Assessments & Rubric Builder Module
* **Location:** [frontend/src/app/features/assessments](file:///f:/Shohaib/Project/Outcome_Based_Education-Management-System/frontend/src/app/features/assessments/assessment-manager.component.ts)
* **Function:** Exam, Assignment, Quiz, and Project scheme setup, CO mapping, weightage calculation, and a multi-level Evaluation Rubric preview.

### 4. 📊 Student Attainment & CQI Engine
* **Location:** [frontend/src/app/features/results](file:///f:/Shohaib/Project/Outcome_Based_Education-Management-System/frontend/src/app/features/results/attainment-analytics.component.ts)
* **Function:** Cohort and student-level direct outcome attainment metrics, gap analysis alerts, and accreditation audit PDF generation.

### 5. 🤖 AI Curriculum & CO-PO Alignment Assistant
* **Location:** [frontend/src/app/features/ai-assistant](file:///f:/Shohaib/Project/Outcome_Based_Education-Management-System/frontend/src/app/features/ai-assistant/ai-assistant.component.ts)
* **Function:** LLM-powered syllabus analyzer that extracts CLOs, classifies Bloom's Taxonomy, and recommends PLO mapping weights with rationale.

### 6. 🔔 Real-Time Notification Center & Toast Engine
* **Location:** [frontend/src/app/core/notification](file:///f:/Shohaib/Project/Outcome_Based_Education-Management-System/frontend/src/app/core/notification/notification.service.ts)
* **Function:** Header bell notification dropdown, full Notification Management Center page (`/dashboard/notifications`), and auto-dismissing Toast popups.

---

## 🏛️ Full Architecture Overview

This repository is designed as a modern, cloud-ready Outcome-Based Education Management System. The architecture combines business-driven domain modeling, microservices, a modern Angular frontend, event-driven integration patterns, and scalable cloud deployment practices.

### Phase 1 — Business Architecture

#### Business purpose
The system exists to help universities and academic institutions manage learning outcomes, assessments, curriculum alignment, accreditation evidence, and continuous improvement in a unified and governed way.

#### Core business goals
- Standardize outcome definition across programs and courses.
- Improve transparency in assessment and student achievement.
- Provide auditable evidence for accreditation and quality assurance.
- Reduce manual reporting effort and administrative overhead.
- Create a foundation for data-driven curriculum improvement.

#### Primary stakeholders
- Institutional leadership and deans
- Department heads and program coordinators
- Faculty and course instructors
- Students
- Quality assurance and accreditation teams
- IT and platform administrators

#### Business capabilities
- Program and curriculum management
- Learning outcome definition and governance
- Assessment lifecycle management
- Student result tracking
- Curriculum alignment and gap analysis
- Reporting and accreditation support
- Continuous improvement workflows
- Role-based governance and access control

#### Business value streams
- Program setup and curriculum publication
- Assessment execution and grading
- Report generation and accreditation preparation
- Continuous improvement tracking and intervention planning

---

### Phase 2 — Domain & Database Architecture

#### Core business domain model
The system is organized around a rich academic domain:
- Institution
- Tenant or academic unit
- Program
- Course
- Program outcome
- Course outcome
- Assessment
- Student result
- Report and improvement action

#### Key domain relationships
- A program contains multiple courses.
- A course maps to one or more course outcomes.
- Course outcomes are linked to program outcomes.
- Assessments are associated with course outcomes.
- Student results are recorded against assessments and contribute to outcome achievement metrics.

#### Database design principles
- Strong relational integrity between academic entities.
- Clear separation between master data and transactional data.
- Support for historical versions of outcomes and assessments.
- Auditability for accreditation and compliance processes.
- Multi-tenant awareness for institutional and departmental isolation.

#### Recommended persistence approach
- Use a relational database such as MySQL for core transactional data.
- Use normalized schemas for academic entities and mappings.
- Use indexed reporting tables or materialized summaries for analytics-heavy queries.
- Retain immutable audit logs for governance and evidence.

#### Example entity groups
- User and roles
- Program and department
- Course and syllabus metadata
- Outcome and mapping tables
- Assessment and rubric definitions
- Student submissions and scores
- Reports and improvement recommendations

---

### Phase 3 — Backend Architecture

#### Architectural style
The backend is implemented as a modular microservices system built with Spring Boot and Spring Cloud.

#### Service structure
- Discovery service for service registration and lookup
- API Gateway for request routing and centralized access control
- Auth service for authentication, authorization, user management, and token issuance
- Core service for business domain logic, academic operations, and reporting support

#### Backend design goals
- Independent deployment of business services
- Clear separation of concerns
- Externalized configuration and environment-based deployment
- Support for API security, validation, and observability
- Extensibility for future services such as reporting, notifications, and analytics

#### Common backend responsibilities
- RESTful API exposure
- JWT-based security
- Validation and error handling
- Database access through repositories and services
- Logging, metrics, and health checks
- Service-to-service communication via the gateway and internal APIs

#### Suggested backend patterns
- Controller → Service → Repository layering
- DTOs for external API contracts
- Domain entities with explicit business logic
- Exception handling middleware and structured API responses
- OpenAPI/Swagger documentation for API discoverability

---

### Phase 4 — Frontend Architecture

#### Frontend goals
The frontend is a modern Angular single-page application focused on usability, modularity, performance, and maintainability.

#### Frontend architecture layers
- Presentation layer for pages, views, and reusable UI components
- State management layer using Angular Signals and reactive patterns
- Service layer for API communication and data access
- Interceptor layer for authentication, error handling, loading, and tenant context
- Shared component and feature module organization

#### Recommended frontend structure
- Core module for guards, auth, interceptors, and shared services
- Shared module for reusable UI primitives
- Feature modules for authentication, dashboard, programs, courses, outcomes, assessments, and reporting

#### UI design principles
- Responsive interface for desktop and mobile use
- Clear navigation and role-based dashboards
- Consistent component library and shared design tokens
- Progressive loading and smooth interaction patterns
- Accessible and form-friendly user experience

#### State management approach
- Use Signals for local and feature-specific state
- Use computed signals for derived values such as filtered lists and summary metrics
- Use service-based coordination for API-driven features
- Keep components focused on rendering while services manage data flow

---

### Phase 5 — Event-Driven & AI Architecture

#### Event-driven integration model
The platform can evolve into an event-driven system where important business actions trigger asynchronous events such as:
- user registration
- assessment submission
- outcome update
- report generation request
- improvement action creation

#### Examples of event flows
- On assessment submission, publish an event to update analytics and notification services.
- On outcome threshold breach, publish an event for review workflows or alerts.
- On report generation completion, publish a completion event for downstream consumers.

#### Why event-driven architecture matters
- Decouples services for better scaling and resilience
- Enables asynchronous processing for heavy analytics or notifications
- Supports future integration with external systems and educational platforms

#### AI and intelligent capabilities
The architecture can later support:
- predictive analytics for student performance trends
- recommendation engines for curriculum or assessment improvements
- intelligent report summarization
- anomaly detection in outcome attainment data
- personalized guidance for faculty and administrators

#### AI readiness principles
- Keep business data structured and clean.
- Separate operational services from analytics services.
- Support event-based data pipelines for training and inference.
- Maintain governance around privacy, model explainability, and data protection.

---

### Phase 6 — Infrastructure, DevOps & Cloud

#### Deployment model
The platform is designed for containerized deployment and future cloud-native scaling.

#### Infrastructure components
- Container runtime with Docker
- Orchestration with Kubernetes or managed cloud equivalents
- Service discovery via Eureka
- Reverse proxy and API gateway for external traffic
- Database service with relational storage and backup strategy
- Monitoring and logging pipelines
- Optional caching for performance and session acceleration

#### DevOps considerations
- Environment-based configuration for development, testing, and production
- CI/CD pipelines for automated build, test, and deployment
- Health checks and automated rollback readiness
- Infrastructure as code for repeatable environments
- Centralized observability using logs, metrics, and traces

#### Cloud deployment targets
- Azure Kubernetes Service
- Amazon ECS or EKS
- Google Kubernetes Engine
- Managed database and storage services

#### Reliability and security targets
- High availability for critical services
- Secure authentication and secret management
- Network isolation and protected service communication
- Audit logging and compliance-friendly retention policies

---

## 🚀 Quick Start

### **1. Start Backend Services** (5 minutes)

```bash
# Terminal 1: Discovery Server
cd backend/Discovery
./mvnw spring-boot:run
# Access: http://localhost:8761

# Terminal 2: API Gateway
cd backend/Api-Gateway
./mvnw spring-boot:run
# Access: http://localhost:8080

# Terminal 3: Auth Service
cd backend/objectbasedoutcome
./mvnw spring-boot:run
# Swagger: http://localhost:8081/swagger-ui.html

# Terminal 4: Core Service
cd backend/Core
./mvnw spring-boot:run
# Swagger: http://localhost:8082/swagger-ui.html
```

### **2. Start Frontend**

```bash
cd frontend
npm install
npm start
# Access: http://localhost:4200
```

### **3. Test the System**

```bash
# Register a user
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@university.edu",
    "password":"Test@123456",
    "firstName":"John",
    "lastName":"Doe"
  }'

# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@university.edu",
    "password":"Test@123456"
  }'

# Create a course
curl -X POST http://localhost:8080/core/courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "courseCode":"CS101",
    "courseName":"Intro to CS",
    "creditHours":3
  }'
```

---

## 📁 Project Structure

```
objectbasedoutcome/
├── backend/                              # All backend microservices
│   ├── Discovery/                        # Service registry (Eureka)
│   ├── Api-Gateway/                      # Single entry point
│   ├── objectbasedoutcome/               # Auth service
│   ├── Core/                             # Business logic
│   └── README.md                         # Backend setup guide
│
├── frontend/                             # Angular 20 SPA
│   ├── src/
│   │   ├── app/                          # Application modules
│   │   ├── styles/                       # Global styling
│   │   └── index.html                    # Entry point
│   └── package.json                      # Dependencies
│
├── docs/                                 # Architecture documentation
│   ├── Architecture.md                   # System architecture
│   └── FrontendArchitecture.md           # Frontend design
│
├── _bmad/                                # Configuration system
│   ├── config.toml                       # Global config
│   ├── _config/                          # Config manifests
│   └── scripts/                          # Config utilities
│
├── SYSTEM_VISION_AND_DESIGN.md           # Complete system design
├── FRONTEND_ARCHITECTURE_DETAILED.md     # Frontend implementation guide
├── OPTIMIZATION_AND_BEST_PRACTICES.md    # Performance & security
└── README.md                             # This file
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────┐
│     Angular Frontend (Port 4200)        │
└──────────────┬──────────────────────────┘
               │ HTTP/REST/JSON
┌──────────────▼──────────────────────────┐
│   API Gateway (Port 8080)               │
│   • Routing  • Auth  • Rate Limit       │
└──────────────┬──────────────────────────┘
     ┌─────────┼─────────┬────────────┐
     ▼         ▼         ▼            ▼
  ┌─────┐  ┌─────┐  ┌─────┐    ┌──────┐
  │Auth │  │Core │  │Rept │    │Notif │
  │8081 │  │8082 │  │8083 │    │ 8084 │
  └─────┘  └─────┘  └─────┘    └──────┘
     │         │         │         │
     └─────────┼─────────┼─────────┘
          Discovery Server (8761)
               │
          Service Registry
               │
          MySQL Database
```

---

## 🎯 What This System Does

### **For Administrators**
- ✅ Configure academic programs and courses
- ✅ Manage user roles and permissions
- ✅ Monitor system performance
- ✅ Access compliance reports

### **For Faculty**
- ✅ Define course learning outcomes
- ✅ Create and manage assessments
- ✅ Record student results
- ✅ Generate effectiveness reports
- ✅ Track curriculum alignment

### **For Students**
- ✅ View personal learning progress
- ✅ Understand course objectives
- ✅ Submit assessments
- ✅ Track achievement of outcomes

### **For Institutions**
- ✅ Aggregate program effectiveness data
- ✅ Generate accreditation reports
- ✅ Identify curriculum gaps
- ✅ Make data-driven improvements

---

## 💻 Technology Stack

### **Backend**
- **Framework:** Spring Boot 3.3.4
- **Language:** Java 17
- **Database:** MySQL 8.0+
- **Messaging:** Optional (RabbitMQ/Kafka)
- **Cache:** Redis (optional for distributed systems)
- **Discovery:** Eureka
- **API Documentation:** Swagger/OpenAPI

### **Frontend**
- **Framework:** Angular 20
- **Language:** TypeScript 5.9
- **State Management:** Angular Signals
- **Styling:** SCSS + Tailwind CSS + Material Design
- **Component Architecture:** Standalone Components
- **Build Tool:** Angular CLI 20.3.8

### **Infrastructure**
- **Container:** Docker
- **Orchestration:** Kubernetes (optional)
- **Monitoring:** Prometheus + Grafana (optional)
- **Logging:** ELK Stack (optional)

---

## 📊 Key Features

### **Core OBE Management**
- Program and course outcome definition
- Course-to-outcome mapping
- Assessment creation and management
- Student result recording
- Multi-tiered outcome tracking

### **Analytics & Reporting**
- Outcome achievement rates
- Trend analysis over semesters
- Curriculum alignment reports
- Effectiveness dashboards
- PDF export capabilities

### **User Management**
- Role-based access control (RBAC)
- Multi-tenant support
- JWT-based authentication
- Email verification
- Password management

### **Performance & Scalability**
- Microservices architecture
- Horizontal scaling
- Database replication
- Distributed caching
- Async processing

---

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Role-Based Access Control** - Fine-grained permissions
- **Multi-Tenant Isolation** - Complete data separation
- **Password Hashing** - BCrypt with salt
- **HTTPS/TLS** - Encrypted communication
- **Audit Logging** - Complete action tracking
- **Rate Limiting** - Protection against abuse
- **Input Validation** - SQL injection prevention

---

## 🚀 Deployment Options

### **Local Development**
```bash
# All services on one machine
Discovery (8761) + Gateway (8080) + Services (8081-8084) + Frontend (4200)
```

### **Docker Containers**
```bash
docker-compose up
# All services containerized and networked
```

### **Kubernetes Cluster**
```bash
kubectl apply -f k8s/
# Production-grade multi-replica deployment
```

### **Cloud Platforms**
- AWS (ECS, RDS, ElastiCache)
- Google Cloud (GKE, Cloud SQL)
- Azure (AKS, Azure Database)

---

## 📈 Performance Metrics

**Target Performance:**
- API response time: < 500ms (95th percentile)
- System uptime: 99.9%
- Cache hit rate: > 80%
- Database query time: < 100ms
- Frontend First Contentful Paint: < 1.5s

---

## 🧪 Testing

### **Backend Testing**
```bash
cd backend
./mvnw test
```

### **Frontend Testing**
```bash
cd frontend
npm test
```

### **Integration Testing**
```bash
cd backend
./mvnw verify
```

---

## 📖 Learning Path

### **Week 1: Understand the System**
1. Read [System Vision & Design](./SYSTEM_VISION_AND_DESIGN.md)
2. Review [Architecture](./docs/Architecture.md)
3. Study Entity Models in service READMEs

### **Week 2: Setup & Run Locally**
1. Follow [Backend README](./backend/README.md) setup
2. Start each service individually
3. Test APIs using Swagger UI or curl

### **Week 3: Develop Backend**
1. Review [Backend Best Practices](./OPTIMIZATION_AND_BEST_PRACTICES.md)
2. Study existing service implementations
3. Extend business logic in Core Service

### **Week 4: Develop Frontend**
1. Study [Frontend Architecture](./FRONTEND_ARCHITECTURE_DETAILED.md)
2. Understand Signals-based state management
3. Build new features following patterns

---

## 🤝 Contributing

### **Code Standards**
- Follow existing code patterns
- Write tests for new features
- Document your changes
- Follow naming conventions

### **Pull Request Process**
1. Create feature branch: `git checkout -b feature/name`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/name`
4. Submit pull request with description

---

## 🐛 Troubleshooting

### **Services Won't Start**
- Check MySQL is running
- Verify ports are not in use
- Check configuration files
- Review service logs

### **Gateway Routing Issues**
- Verify services registered in Eureka
- Check URL routes in gateway config
- Ensure service names match Eureka registration

### **Database Connection Errors**
- Verify MySQL credentials
- Check database exists
- Confirm network connectivity
- Review datasource config

### **Frontend Not Connecting**
- Verify backend services are running
- Check CORS configuration
- Verify API gateway is accessible
- Check browser console for errors

See [Optimization Guide](./OPTIMIZATION_AND_BEST_PRACTICES.md) for detailed troubleshooting.

---

## 📞 Support & Resources

### **Documentation**
- [System Design](./SYSTEM_VISION_AND_DESIGN.md) - Complete architecture
- [API Documentation](./backend/README.md) - REST endpoints
- [Frontend Guide](./FRONTEND_ARCHITECTURE_DETAILED.md) - UI implementation

### **Tools & Resources**
- Swagger UI: http://localhost:8081/swagger-ui.html
- Eureka Dashboard: http://localhost:8761
- MySQL: `mysql -u root -p obe_ms`

### **Community**
- [GitHub Issues](https://github.com/shohaib/obe-ms/issues)
- [Discussions](https://github.com/shohaib/obe-ms/discussions)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎉 Ready to Build!

Everything you need is documented. Choose your path:

- **Architects:** Start with [System Vision & Design](./SYSTEM_VISION_AND_DESIGN.md)
- **Backend Developers:** Go to [Backend README](./backend/README.md)
- **Frontend Developers:** Check [Frontend Architecture](./FRONTEND_ARCHITECTURE_DETAILED.md)
- **DevOps:** See [Optimization Guide](./OPTIMIZATION_AND_BEST_PRACTICES.md)
- **Project Managers:** Read [System Overview](./docs/Architecture.md)

**Questions?** Check the relevant README or troubleshooting section.

**Ready to contribute?** Follow the Contributing guidelines above.

**Let's build the future of outcome-based education!** 🚀

---

**Project Status:** ✅ Production Ready  
**Last Updated:** July 2026  
**Version:** 1.0.0  
**Maintainer:** Development Team
