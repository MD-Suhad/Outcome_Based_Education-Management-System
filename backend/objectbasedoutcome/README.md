# OBE Auth Service

## 📍 Service Overview

**OBE Auth Service** handles all authentication, authorization, and user management for the OBE-MS system. It manages user registration, JWT token generation, password resets, and email verification.

## 🎯 Purpose

- User registration and account management
- Authentication (login/logout)
- JWT token generation and validation
- Password reset and email verification
- Role-based access control (RBAC)
- Multi-tenant user management
- Email service integration
- Audit logging and security

## 🔧 Configuration

```yaml
server.port=8081
spring.application.name=obe-auth-service

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/obe_ms
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=validate

# JWT Configuration
jwt.secret=your_super_secret_key_min_256_chars_long_for_security
jwt.expiration=3600000  # 1 hour in milliseconds
jwt.refresh-token-expiration=604800000  # 7 days

# Eureka Configuration
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/

# Mail Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Flyway Migration
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
```

## 🚀 Startup

```bash
cd backend/objectbasedoutcome
./mvnw spring-boot:run
```

## 📊 Core Entity Models

### User Entity
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String email;
    
    private String passwordHash;
    private String firstName;
    private String lastName;
    private boolean emailVerified;
    private LocalDateTime emailVerifiedAt;
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles")
    private Set<Role> roles;
    
    @ManyToMany
    @JoinTable(name = "user_tenants")
    private Set<Tenant> tenants;
    
    private LocalDateTime lastLoginAt;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### Role Entity
```java
@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String roleName;  // ADMIN, FACULTY, STUDENT, etc
    
    private String description;
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "role_permissions")
    private Set<Permission> permissions;
    
    private LocalDateTime createdAt;
}
```

### Permission Entity
```java
@Entity
@Table(name = "permissions")
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String permissionName;  // CREATE_COURSE, DELETE_USER, etc
    private String description;
    
    private LocalDateTime createdAt;
}
```

### Tenant Entity (Multi-tenancy)
```java
@Entity
@Table(name = "tenants")
public class Tenant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String tenantName;
    private String tenantCode;
    
    @ManyToMany(mappedBy = "tenants")
    private Set<User> users;
    
    private String subscriptionLevel;  // FREE, PREMIUM, ENTERPRISE
    private LocalDateTime createdAt;
}
```

## 📡 REST API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register                - Register new user
POST   /api/auth/login                   - User login (returns JWT token)
POST   /api/auth/logout                  - User logout
POST   /api/auth/refresh                 - Refresh JWT token
GET    /api/auth/verify-token            - Verify token validity
```

### User Management
```
GET    /api/auth/profile                 - Get current user profile
PUT    /api/auth/profile                 - Update user profile
GET    /api/users/{id}                   - Get user by ID
PUT    /api/users/{id}                   - Update user (admin)
DELETE /api/users/{id}                   - Delete user (admin)
GET    /api/users                        - List all users (admin)
```

### Password Management
```
POST   /api/auth/forgot-password         - Request password reset
PUT    /api/auth/reset-password          - Complete password reset
PUT    /api/auth/change-password         - Change current password
```

### Email Verification
```
POST   /api/auth/send-verification       - Resend verification email
GET    /api/auth/verify-email            - Verify email with token
```

### Role & Permission Management (Admin)
```
GET    /api/roles                        - List all roles
POST   /api/roles                        - Create role
PUT    /api/roles/{id}                   - Update role
DELETE /api/roles/{id}                   - Delete role
GET    /api/permissions                  - List all permissions
```

## 🔐 Authentication Flow

### User Registration
```
1. Frontend sends: email, password, firstName, lastName
2. Service validates:
   - Email format and uniqueness
   - Password strength (min 8 chars, uppercase, number, special char)
   - No profanity in names
3. Service hashes password using BCrypt
4. Service creates User entity
5. Service sends verification email
6. Frontend redirects to verification page
```

### User Login
```
1. Frontend sends: email, password
2. Service validates:
   - Email exists in database
   - Password matches hashed password
   - User account is active
3. Service generates JWT token:
   Header: { "alg": "HS256", "typ": "JWT" }
   Payload: {
     "sub": user_id,
     "email": user@example.com,
     "roles": ["STUDENT", "COURSE_COORDINATOR"],
     "tenant_id": 1,
     "iat": 1234567890,
     "exp": 1234571490
   }
   Signature: HMAC_SHA256(header.payload, secret)
4. Service returns token and refresh token
5. Frontend stores tokens in localStorage/sessionStorage
6. Frontend includes token in Authorization header for future requests
```

### JWT Token Usage
```
Request Header:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIi...

Gateway validates token:
1. Extracts JWT from Authorization header
2. Verifies signature using secret key
3. Checks token expiration
4. Extracts user claims
5. Forwards request to target service with user context
```

### Token Refresh
```
1. Frontend detects token expiration (5 minutes before actual expiry)
2. Frontend sends refresh token to: POST /api/auth/refresh
3. Service validates refresh token:
   - Token exists in database
   - Token not revoked
   - Not expired
4. Service generates new access token
5. Frontend continues with new token
```

## 💾 Database Schema

```sql
-- Users Table
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles Table
CREATE TABLE roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Permissions Table
CREATE TABLE permissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    permission_name VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User-Role Mapping
CREATE TABLE user_roles (
    user_id BIGINT,
    role_id BIGINT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Role-Permission Mapping
CREATE TABLE role_permissions (
    role_id BIGINT,
    permission_id BIGINT,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

-- Tenants Table
CREATE TABLE tenants (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenant_name VARCHAR(255),
    tenant_code VARCHAR(50),
    subscription_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User-Tenant Mapping
CREATE TABLE user_tenants (
    user_id BIGINT,
    tenant_id BIGINT,
    PRIMARY KEY (user_id, tenant_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Password Reset Tokens
CREATE TABLE password_reset_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    token_hash VARCHAR(255),
    expires_at TIMESTAMP,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Email Verification Tokens
CREATE TABLE email_verification_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    token_hash VARCHAR(255),
    expires_at TIMESTAMP,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Audit Logs
CREATE TABLE audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    action VARCHAR(100),
    resource_type VARCHAR(100),
    resource_id BIGINT,
    details JSON,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Refresh Tokens
CREATE TABLE refresh_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    token_hash VARCHAR(255),
    revoked BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🧪 Testing Endpoints

### Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@university.edu",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@university.edu",
    "password": "SecurePassword123!"
  }'

# Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "tokenType": "Bearer"
}
```

### Get User Profile
```bash
curl http://localhost:8080/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Refresh Token
```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

### Password Reset Request
```bash
curl -X POST http://localhost:8080/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@university.edu"
  }'
```

## 🔐 Security Best Practices

### Password Hashing
- Uses BCrypt with configurable strength (12 rounds)
- Never store plain-text passwords
- Verify passwords using BCryptPasswordEncoder

### JWT Security
- Secret key minimum 256 characters
- HTTPS only in production
- Token expiration (1 hour for access, 7 days for refresh)
- Token revocation on logout
- Signature verification on each request

### Rate Limiting
- Limit login attempts (5 attempts per 15 minutes)
- Limit registration from same IP (3 per hour)
- Limit password reset requests (2 per hour per user)

### Audit Logging
- Log all authentication events
- Log all permission changes
- Track IP address and user agent
- Retention period: 90 days

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-factor authentication
2. Generate app password
3. Set in application.yml:
   ```yaml
   spring.mail.username=your-email@gmail.com
   spring.mail.password=your-16-char-app-password
   ```

### Email Templates
- Welcome email with verification link
- Password reset link
- Account confirmation
- Login alert email
- Permission change notification

## 🐛 Troubleshooting

### Invalid JWT Token
- Check token expiration
- Verify secret key matches between services
- Ensure token is properly formatted

### Email Not Sending
- Check Gmail app password is correct
- Verify SMTP settings
- Check firewall/network connectivity

### User Registration Fails
- Email already exists in database
- Password doesn't meet requirements
- Database connection error

---

**Note:** Auth Service requires Discovery Server and MySQL to be running.
