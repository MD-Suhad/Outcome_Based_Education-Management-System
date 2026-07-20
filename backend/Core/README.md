# Core Service

## 📍 Service Overview

**Core Service** contains the main business logic and data models for the OBE-MS system. It manages courses, learning outcomes, assessments, and generates educational effectiveness reports.

## 🎯 Purpose

- Manage courses and program outcomes
- Define and map course objectives to assessments
- Store and retrieve assessment results
- Generate educational effectiveness reports
- Provide shared data models and business logic
- Support inter-service communication via Feign

## 🔧 Configuration

```yaml
server.port=8082
spring.application.name=core-service

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/obe_ms
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# Eureka Configuration
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
eureka.instance.client.serverUrl.default=http://localhost:8761/eureka/

# Feign Client Configuration
feign.client.config.default.connectTimeout=5000
feign.client.config.default.readTimeout=5000
```

## 🚀 Startup

```bash
cd backend/Core
./mvnw spring-boot:run
```

## 📊 Core Entity Models

### Course Entity
```java
@Entity
public class Course {
    @Id
    private Long id;
    
    private String courseCode;        // CS101
    private String courseName;        // Intro to CS
    private String description;
    private String department;
    private int creditHours;
    
    @ManyToMany
    private Set<ProgramOutcome> programOutcomes;
    
    @OneToMany(mappedBy = "course")
    private Set<CourseOutcome> courseOutcomes;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### ProgramOutcome Entity
```java
@Entity
public class ProgramOutcome {
    @Id
    private Long id;
    
    private String outcomeStatement;  // "Students will demonstrate..."
    private String level;            // PLO1, PLO2, etc
    private int version;
    
    @ManyToMany(mappedBy = "programOutcomes")
    private Set<Course> courses;
    
    @OneToMany(mappedBy = "outcome")
    private Set<Assessment> assessments;
    
    private LocalDateTime createdAt;
}
```

### Assessment Entity
```java
@Entity
public class Assessment {
    @Id
    private Long id;
    
    private String assessmentName;    // Midterm Exam
    private String assessmentType;    // EXAM, PROJECT, etc
    private String rubric;           // Assessment criteria
    private double passingScore;
    
    @ManyToOne
    private ProgramOutcome outcome;
    
    @OneToMany(mappedBy = "assessment")
    private Set<StudentResult> results;
    
    private LocalDateTime createdAt;
}
```

### CourseOutcome Entity
```java
@Entity
public class CourseOutcome {
    @Id
    private Long id;
    
    @ManyToOne
    private Course course;
    
    @ManyToOne
    private ProgramOutcome outcome;
    
    @OneToMany
    private Set<Assessment> assessmentMethods;
    
    private String alignmentNotes;
    private LocalDateTime createdAt;
}
```

## 📡 REST API Endpoints

### Course Management
```
GET    /api/core/courses                    - List all courses
POST   /api/core/courses                    - Create new course
GET    /api/core/courses/{id}               - Get course details
PUT    /api/core/courses/{id}               - Update course
DELETE /api/core/courses/{id}               - Delete course
GET    /api/core/courses/{id}/outcomes      - Get course outcomes
```

### Program Outcomes
```
GET    /api/core/outcomes                   - List all program outcomes
POST   /api/core/outcomes                   - Create outcome
GET    /api/core/outcomes/{id}              - Get outcome details
PUT    /api/core/outcomes/{id}              - Update outcome
DELETE /api/core/outcomes/{id}              - Delete outcome
GET    /api/core/outcomes/{id}/assessments  - Get assessments for outcome
```

### Course-Outcome Mapping
```
POST   /api/core/mappings                   - Map course to outcomes
GET    /api/core/mappings/courses/{courseId} - Get mappings for course
PUT    /api/core/mappings/{id}              - Update mapping
DELETE /api/core/mappings/{id}              - Delete mapping
```

### Assessments
```
GET    /api/core/assessments                - List assessments
POST   /api/core/assessments                - Create assessment
GET    /api/core/assessments/{id}           - Get assessment details
PUT    /api/core/assessments/{id}           - Update assessment
DELETE /api/core/assessments/{id}           - Delete assessment
POST   /api/core/assessments/{id}/results   - Submit student result
```

### Reports & Analytics
```
GET    /api/core/reports/effectiveness     - Generate effectiveness report
GET    /api/core/reports/summary            - Outcome achievement summary
GET    /api/core/reports/trends             - Trend analysis over time
POST   /api/core/reports/export             - Export report as PDF
GET    /api/core/analytics/course-outcomes  - Analytics dashboard data
```

## 📨 Feign Client Example (Inter-service Communication)

```java
@FeignClient(name = "obe-auth-service")
public interface AuthServiceClient {
    @GetMapping("/api/users/{id}")
    UserDTO getUser(@PathVariable Long id);
    
    @GetMapping("/api/users/email/{email}")
    UserDTO getUserByEmail(@PathVariable String email);
}
```

## 💾 Database Schema

```sql
-- Courses
CREATE TABLE courses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_code VARCHAR(50),
    course_name VARCHAR(255),
    description TEXT,
    department VARCHAR(100),
    credit_hours INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Program Outcomes
CREATE TABLE program_outcomes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    outcome_statement TEXT,
    level VARCHAR(50),
    version INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Course-Outcome Mapping
CREATE TABLE course_outcomes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_id BIGINT,
    outcome_id BIGINT,
    alignment_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (outcome_id) REFERENCES program_outcomes(id)
);

-- Assessments
CREATE TABLE assessments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    assessment_name VARCHAR(255),
    assessment_type VARCHAR(50),
    rubric TEXT,
    passing_score DECIMAL(5, 2),
    outcome_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (outcome_id) REFERENCES program_outcomes(id)
);

-- Student Results
CREATE TABLE student_results (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT,
    assessment_id BIGINT,
    score DECIMAL(5, 2),
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id)
);

-- Reports
CREATE TABLE reports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    report_type VARCHAR(100),
    generated_by BIGINT,
    content LONGBLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔍 Key Business Logic

### Calculate Course Effectiveness
```java
public EffectivenessReport calculateEffectiveness(Long courseId) {
    Course course = courseRepository.findById(courseId);
    Set<ProgramOutcome> outcomes = course.getProgramOutcomes();
    
    Map<ProgramOutcome, Double> achievementRates = new HashMap<>();
    
    for (ProgramOutcome outcome : outcomes) {
        Double rate = assessmentRepository
            .findByOutcome(outcome)
            .stream()
            .mapToDouble(a -> a.getPassRate())
            .average()
            .orElse(0.0);
        
        achievementRates.put(outcome, rate);
    }
    
    return new EffectivenessReport(course, achievementRates);
}
```

### Generate Assessment Analytics
```java
public AssessmentAnalytics getAnalytics(Long assessmentId) {
    Assessment assessment = assessmentRepository.findById(assessmentId);
    List<StudentResult> results = resultRepository.findByAssessment(assessment);
    
    return AssessmentAnalytics.builder()
        .totalAttempts(results.size())
        .passRate(results.stream()
            .filter(r -> r.getScore() >= assessment.getPassingScore())
            .count() / (double) results.size())
        .averageScore(results.stream()
            .mapToDouble(StudentResult::getScore)
            .average()
            .orElse(0.0))
        .highestScore(results.stream()
            .mapToDouble(StudentResult::getScore)
            .max()
            .orElse(0.0))
        .build();
}
```

## 🧪 Testing Endpoints

### Create a Course
```bash
curl -X POST http://localhost:8080/core/courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "courseCode": "CS101",
    "courseName": "Introduction to Computer Science",
    "description": "Foundational concepts",
    "department": "Computer Science",
    "creditHours": 3
  }'
```

### Get All Courses
```bash
curl http://localhost:8080/core/courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Program Outcome
```bash
curl -X POST http://localhost:8080/core/outcomes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "outcomeStatement": "Students will demonstrate understanding of data structures",
    "level": "PLO1"
  }'
```

### Map Course to Outcome
```bash
curl -X POST http://localhost:8080/core/mappings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": 1,
    "outcomeId": 1,
    "alignmentNotes": "Covers in Unit 2-3"
  }'
```

### Generate Effectiveness Report
```bash
curl http://localhost:8080/core/reports/effectiveness?courseId=1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 Performance Considerations

### Database Indexing
```sql
CREATE INDEX idx_course_code ON courses(course_code);
CREATE INDEX idx_assessment_type ON assessments(assessment_type);
CREATE INDEX idx_student_results_score ON student_results(score);
CREATE INDEX idx_outcome_level ON program_outcomes(level);
```

### Query Optimization
- Use JPA projections for read-only queries
- Lazy load relationships when appropriate
- Cache frequently accessed data (outcomes, courses)

## 🐛 Troubleshooting

### Service Won't Start
- Check MySQL is running
- Verify database credentials
- Check port 8082 is not in use

### Feign Client Calls Fail
- Ensure Auth Service is running and registered
- Check service name matches Eureka registration
- Verify network connectivity

### Report Generation Slow
- Add indexes to student_results table
- Consider caching report data
- Use pagination for large datasets

---

**Note:** Core Service requires Discovery Server and MySQL to be running.
