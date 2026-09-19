# Outcome-Based Education Management System (OBE-MS)
## REST API & OpenAPI 3.0 Specification Blueprint

> **Document Status:** Official Production API Specification  
> **Base Gateway URL:** `http://localhost:8080/api/v1`  
> **Authentication:** Bearer JWT Token passed in `Authorization` header (`Bearer <access_token>`)  
> **Content-Type:** `application/json`  
> **Error Specification:** RFC 7807 (`application/problem+json`)

---

## 1. Authentication Service API (`:8081`)

### 1.1 Authentication & Tokens

#### `POST /auth/login`
Authenticates a user and issues JWT Access & Refresh Tokens.

- **Request Headers:**
  - `Content-Type`: `application/json`
- **Request Body:**
  ```json
  {
    "email": "faculty@university.edu",
    "password": "Password123!",
    "tenantId": "univ-dept-cs-01"
  }
  ```
- **Response Codes:**
  - `200 OK`: Authentication successful.
  - `401 Unauthorized`: Invalid credentials or missing tenant context.
- **Success Response Payload:**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "d8f3e501-8b2c-4712-9c12-ef4a2a11009a",
    "tokenType": "Bearer",
    "expiresIn": 86400,
    "user": {
      "id": "usr-9012",
      "name": "Dr. Alan Turing",
      "email": "faculty@university.edu",
      "role": "FACULTY",
      "department": "Computer Science & Engineering"
    }
  }
  ```

#### `POST /auth/refresh`
Exchanges a valid Refresh Token for a new JWT Access Token.

- **Request Body:**
  ```json
  {
    "refreshToken": "d8f3e501-8b2c-4712-9c12-ef4a2a11009a"
  }
  ```
- **Success Response Payload:**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400
  }
  ```

#### `GET /auth/me`
Fetches current authenticated user context and permissions.

- **Request Headers:**
  - `Authorization`: `Bearer <access_token>`
- **Success Response Payload:**
  ```json
  {
    "id": "usr-9012",
    "name": "Dr. Alan Turing",
    "email": "faculty@university.edu",
    "role": "FACULTY",
    "permissions": [
      "COURSE_READ",
      "COURSE_WRITE",
      "ASSESSMENT_MANAGE",
      "RESULT_GRADE"
    ]
  }
  ```

---

## 2. Core OBE Academic Service API (`:8082`)

### 2.1 Program Outcomes (POs / PLOs)

#### `GET /programs/{programId}/outcomes`
Retrieves all Program Outcomes defined for a specified degree program.

- **Parameters:**
  - `programId` (path, string): Unique ID of the academic program (e.g., `bsc-cse`).
- **Success Response Payload:**
  ```json
  [
    {
      "id": "po-01",
      "code": "PO-1",
      "title": "Engineering Knowledge",
      "description": "Apply knowledge of mathematics, science, and engineering fundamentals.",
      "taxonomyDomain": "COGNITIVE",
      "targetAttainment": 75.0,
      "currentAttainment": 78.4
    },
    {
      "id": "po-02",
      "code": "PO-2",
      "title": "Problem Analysis",
      "description": "Identify, formulate, and analyze complex engineering problems.",
      "taxonomyDomain": "COGNITIVE",
      "targetAttainment": 70.0,
      "currentAttainment": 72.1
    }
  ]
  ```

#### `POST /programs/{programId}/outcomes`
Creates a new Program Outcome.

- **Request Body:**
  ```json
  {
    "code": "PO-7",
    "title": "Environment and Sustainability",
    "description": "Understand the impact of professional engineering solutions in societal contexts.",
    "taxonomyDomain": "AFFECTIVE",
    "targetAttainment": 70.0
  }
  ```
- **Response Codes:**
  - `201 Created`

---

### 2.2 Course Outcomes & CO-PO Matrix Mapping

#### `GET /courses/{courseId}/outcomes`
Fetches Course Outcomes (COs) for a given course.

- **Success Response Payload:**
  ```json
  [
    {
      "id": "co-101-1",
      "code": "CO-1",
      "description": "Design and implement relational databases using normalization principles.",
      "bloomsLevel": "APPLY",
      "weight": 25.0
    },
    {
      "id": "co-101-2",
      "code": "CO-2",
      "description": "Optimize SQL queries and execute transaction control commands.",
      "bloomsLevel": "ANALYZE",
      "weight": 25.0
    }
  ]
  ```

#### `PUT /courses/{courseId}/copo-matrix`
Updates the CO-PO correlation matrix weightings for a course.

- **Request Body:**
  ```json
  {
    "mappings": [
      { "coId": "co-101-1", "poId": "po-01", "correlationWeight": 3 },
      { "coId": "co-101-1", "poId": "po-02", "correlationWeight": 2 },
      { "coId": "co-101-2", "poId": "po-02", "correlationWeight": 3 }
    ]
  }
  ```
- **Response Codes:**
  - `200 OK`

---

### 2.3 Assessment Management & Rubrics

#### `POST /courses/{courseId}/assessments`
Configures a new assessment (Exam, Quiz, Assignment, Project) with CO mapping.

- **Request Body:**
  ```json
  {
    "title": "Midterm Examination",
    "type": "EXAM",
    "totalMarks": 100,
    "weightage": 30.0,
    "coMappings": [
      { "coId": "co-101-1", "allocatedMarks": 50 },
      { "coId": "co-101-2", "allocatedMarks": 50 }
    ],
    "rubric": {
      "criteria": [
        {
          "name": "Database Schema Design",
          "levels": [
            { "level": "POOR", "points": 10, "description": "Unnormalized schema with redundancies" },
            { "level": "GOOD", "points": 25, "description": "3NF normalized schema with primary keys" },
            { "level": "EXCELLENT", "points": 50, "description": "BCNF schema with foreign key constraints & indexing" }
          ]
        }
      ]
    }
  }
  ```

---

### 2.4 Attainment Analytics & CQI Engine

#### `GET /attainment/courses/{courseId}/report`
Calculates and retrieves direct CO & PO attainment metrics for a course cohort.

- **Success Response Payload:**
  ```json
  {
    "courseId": "cs-301",
    "courseName": "Database Management Systems",
    "academicTerm": "Fall 2026",
    "enrolledStudents": 64,
    "coAttainments": [
      {
        "coCode": "CO-1",
        "targetPercentage": 70.0,
        "achievedPercentage": 76.5,
        "status": "TARGET_MET"
      },
      {
        "coCode": "CO-2",
        "targetPercentage": 70.0,
        "achievedPercentage": 64.2,
        "status": "GAP_DETECTED",
        "recommendedIntervention": "Conduct remedial workshop on indexing & execution plans."
      }
    ]
  }
  ```

---

## 3. Real-Time Notification Center API

#### `GET /notifications`
Fetches unread system notifications for the authenticated user.

- **Success Response Payload:**
  ```json
  [
    {
      "id": "notif-101",
      "title": "Attainment Gap Warning",
      "message": "CO-2 in CS-301 dropped below target threshold (64.2%).",
      "type": "WARNING",
      "read": false,
      "createdAt": "2026-08-08T01:00:00Z"
    }
  ]
  ```

#### `PATCH /notifications/{id}/read`
Marks a specific notification as read.

---

## 4. AI Curriculum Assistant API

#### `POST /ai/analyze-syllabus`
Analyzes syllabus text using LLM integration to suggest CO extraction and PO correlations.

- **Request Body:**
  ```json
  {
    "syllabusText": "Course covers relational models, SQL optimization, transactions, and indexing...",
    "programOutcomes": ["PO-1", "PO-2", "PO-3"]
  }
  ```
- **Success Response Payload:**
  ```json
  {
    "extractedCOs": [
      {
        "suggestedCode": "CO-1",
        "statement": "Analyze relational schemas and design normalized database structures.",
        "bloomsTaxonomyLevel": "ANALYZE",
        "recommendedPoMappings": [
          { "poCode": "PO-1", "weight": 3, "rationale": "Directly applies core computing principles." }
        ]
      }
    ]
  }
  ```

---

## 5. Standard Error Format (RFC 7807)

When an API error occurs, the server responds with HTTP Status 4xx or 5xx and `Content-Type: application/problem+json`:

```json
{
  "type": "https://obe-ms.university.edu/errors/attainment-calculation-failed",
  "title": "Attainment Calculation Exception",
  "status": 400,
  "detail": "Cannot calculate attainment: 5 student assessment scores are unsubmitted.",
  "instance": "/api/v1/attainment/courses/cs-301/report",
  "timestamp": "2026-08-08T01:19:00Z"
}
```
