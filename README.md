# Outcome-Based Education Management System (OBE-MS)

**A comprehensive, enterprise-grade platform for managing educational outcomes, measuring program effectiveness, and supporting data-driven educational improvements.**

---

## 📖 Quick Navigation

This project contains extensive documentation organized by topic. Choose what you need:

### **🎯 Getting Started**
- **First time here?** Start with [Project Vision & Design](./SYSTEM_VISION_AND_DESIGN.md) to understand the big picture
- **Want to run it locally?** Go to [Backend Setup Guide](./backend/README.md)
- **Frontend dev?** See [Frontend Architecture](./FRONTEND_ARCHITECTURE_DETAILED.md)

### **📚 Complete Documentation**

| Document | Purpose | Audience |
|----------|---------|----------|
| [System Vision & Design](./SYSTEM_VISION_AND_DESIGN.md) | Complete system architecture, data models, scalability, roadmap | Architects, Project Managers |
| [Backend README](./backend/README.md) | All backend services overview and setup | Backend Developers |
| [Frontend Architecture](./FRONTEND_ARCHITECTURE_DETAILED.md) | Angular app structure, Signals, state management | Frontend Developers |
| [Optimization Guide](./OPTIMIZATION_AND_BEST_PRACTICES.md) | Performance tuning, security, caching strategies | All Developers |
| [Architecture Documentation](./docs/Architecture.md) | High-level system design | Everyone |
| [Frontend Architecture Docs](./docs/FrontendArchitecture.md) | Frontend structure and patterns | Frontend Developers |

### **🔧 Individual Service Documentation**

| Service | Port | Purpose | Documentation |
|---------|------|---------|-----------------|
| **Discovery Server** | 8761 | Service registry (Eureka) | [README](./backend/Discovery/README.md) |
| **API Gateway** | 8080 | Request routing & filtering | [README](./backend/Api-Gateway/README.md) |
| **Auth Service** | 8081 | Authentication & user management | [README](./backend/objectbasedoutcome/README.md) |
| **Core Service** | 8082 | Business logic & OBE operations | [README](./backend/Core/README.md) |
| **Frontend** | 4200 | Angular SPA | [Architecture](./FRONTEND_ARCHITECTURE_DETAILED.md) |

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
