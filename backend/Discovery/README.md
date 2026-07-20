# Discovery Server (Eureka Registry)

## 📍 Service Overview

**Discovery Server** is the central service registry for the OBE-MS microservices architecture. It uses Spring Cloud Netflix Eureka to maintain a dynamic registry of all running services.

## 🎯 Purpose

- Maintain real-time registry of all microservices
- Enable dynamic service discovery
- Provide health monitoring of registered services
- Support client-side and server-side load balancing
- Handle service instance registration and deregistration

## 🔧 Configuration

```yaml
server.port=8761
spring.application.name=discovery-server

eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
eureka.server.enable-self-preservation=true
eureka.server.renewal-percent-threshold=0.85
```

## 🚀 Startup

```bash
cd backend/Discovery
./mvnw spring-boot:run
```

## 📊 Dashboard

Access the Eureka Dashboard: **http://localhost:8761**

### Dashboard Features:
- List of all registered services with instances
- Service health status
- Instance metadata and configuration
- Manual service registration/deregistration

## 📡 How Services Register

When Auth Service or Core Service starts:
1. Send registration request to Eureka with metadata
2. Eureka stores instance details (hostname, port, health check URL)
3. Service sends heartbeat every 30 seconds
4. If heartbeat fails for 90 seconds, instance is removed

## 🔍 Service Instance Data

```json
{
  "instanceId": "obe-auth-service:8081",
  "hostname": "localhost",
  "port": 8081,
  "healthCheckUrl": "http://localhost:8081/actuator/health",
  "statusPageUrl": "http://localhost:8081/actuator/info",
  "serviceName": "obe-auth-service",
  "metadata": {
    "management.port": "8081"
  }
}
```

## ✅ Health Check Endpoint

Services must expose: `/actuator/health`

```bash
curl http://localhost:8081/actuator/health
# Response: { "status": "UP" }
```

## 🐛 Troubleshooting

### Services Not Appearing in Dashboard
1. Check service logs for registration errors
2. Verify Eureka URL in service's `application.yml`
3. Ensure service is actually running
4. Check network connectivity to port 8761

### High Memory Usage
- May indicate too many retained instances
- Restart Discovery Server to clear cache
- Monitor with: `http://localhost:8761/actuator/env`

## 📋 REST API (Internal Use)

```bash
# Get all instances of a service
curl http://localhost:8761/eureka/apps/OBE-AUTH-SERVICE

# Get specific instance
curl http://localhost:8761/eureka/apps/OBE-AUTH-SERVICE/obe-auth-service:8081

# Deregister instance
curl -X DELETE http://localhost:8761/eureka/apps/OBE-AUTH-SERVICE/obe-auth-service:8081
```

---

**Note:** Discovery Server should be started first before other services.
