# API Gateway

## 📍 Service Overview

**API Gateway** is the single entry point for all frontend requests to the OBE-MS backend microservices. It uses Spring Cloud Gateway to route, filter, and transform requests.

## 🎯 Purpose

- Single entry point for all client requests
- Request routing to appropriate microservices
- Cross-cutting concerns (authentication, logging, rate limiting)
- Load balancing across service instances
- Request/response transformation
- CORS and security headers management

## 🔧 Configuration

```yaml
server.port=8080
spring.application.name=api-gateway

# Eureka Configuration
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
eureka.instance.client.serverUrl.default=http://localhost:8761/eureka/

# Gateway Routes
spring.cloud.gateway.routes:
  - id: auth-service-route
    uri: lb://obe-auth-service
    predicates:
      - Path=/auth/**
    filters:
      - StripPrefix=0

  - id: core-service-route
    uri: lb://core-service
    predicates:
      - Path=/core/**
    filters:
      - StripPrefix=0
```

## 🚀 Startup

```bash
cd backend/Api-Gateway
./mvnw spring-boot:run
```

## 📊 Request Routing

### URL Mapping

| Frontend URL | Gateway | Target Service | Target URL |
|---|---|---|---|
| `/auth/register` | http://localhost:8080/auth/register | obe-auth-service | http://localhost:8081/auth/register |
| `/auth/login` | http://localhost:8080/auth/login | obe-auth-service | http://localhost:8081/auth/login |
| `/core/courses` | http://localhost:8080/core/courses | core-service | http://localhost:8082/core/courses |
| `/core/outcomes` | http://localhost:8080/core/outcomes | core-service | http://localhost:8082/core/outcomes |

## 🔌 Request Flow

```
Frontend Request
     ↓
Gateway (Port 8080)
     ↓
Route Matcher (checks path predicates)
     ↓
Filter Chain (pre-filters)
     ↓
Load Balancer (lb://service-name)
     ↓
Eureka Discovery (lookup service instance)
     ↓
Target Microservice
     ↓
Response Filters (post-filters)
     ↓
Frontend Response
```

## 🛡️ Gateway Filters

### Pre-Filters
```java
// Custom Authentication Filter
public class AuthenticationFilter implements GatewayFilter {
    public Mono<Void> filter(exchange, chain) {
        String token = extractToken(exchange);
        if (validateToken(token)) {
            exchange.getRequest().mutate()
                .header("X-User-Id", getUserId(token));
            return chain.filter(exchange);
        }
        return unauthorized();
    }
}
```

### Built-in Filters Used
- `StripPrefix` - Remove path prefix before routing
- `RewritePath` - Rewrite request path
- `AddRequestHeader` - Add custom headers
- `AddResponseHeader` - Add response headers
- `CircuitBreaker` - Handle service failures

## 🔍 Monitoring Gateway

### Health Check
```bash
curl http://localhost:8080/actuator/health
```

### List All Routes
```bash
curl http://localhost:8080/actuator/gateway/routes
```

### Response:
```json
[
  {
    "route_id": "auth-service-route",
    "predicates": [
      {
        "name": "Path",
        "args": {
          "pattern": "/auth/**"
        }
      }
    ],
    "filters": [],
    "uri": "lb://obe-auth-service",
    "order": 0
  }
]
```

## 📈 Performance Tuning

### Connection Pool Settings
```yaml
spring.cloud.gateway.httpclient:
  connect-timeout: 5000
  response-timeout: 30s
  pool:
    max-idle-time: 60000
    max-life-time: 1800000
```

### Reactor Settings
```yaml
spring.webflux.base-path: /
spring.webflux.static-path-pattern: /static/**
```

## ⚠️ Common Issues

### Service Not Found (503)
```
Problem: Route returns 503 Service Unavailable
Solution: 
1. Check if target service is running
2. Verify service is registered in Eureka (http://localhost:8761)
3. Check logs for connection errors
```

### CORS Errors
```
Problem: Frontend gets CORS error from gateway
Solution: Configure CORS in gateway:

spring.cloud.gateway.globalcors.corsConfigurations:
  "[/**]":
    allowed-origins: "http://localhost:4200"
    allowed-methods: "GET,POST,PUT,DELETE,OPTIONS"
    allowed-headers: "*"
    allow-credentials: true
```

### Timeout Issues
```
Problem: Requests timeout after 30 seconds
Solution: Adjust response timeout in application.yml:

spring.cloud.gateway.httpclient:
  response-timeout: 60s
```

## 🔐 Security Considerations

### Request Validation
- Validate JWT tokens before forwarding
- Check user permissions for endpoints
- Rate limiting to prevent abuse

### Response Security
- Remove sensitive headers
- Add security headers (X-Content-Type-Options, etc.)
- HTTPS enforcement (in production)

## 📊 Gateway Metrics (if enabled)

```bash
curl http://localhost:8080/actuator/prometheus
```

## 🧪 Testing Gateway

### Test Auth Route
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'
```

### Test Core Route
```bash
curl http://localhost:8080/core/courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Health
```bash
curl -v http://localhost:8080/actuator/health
```

---

**Note:** API Gateway should start after Discovery Server and routes all requests to registered services.
