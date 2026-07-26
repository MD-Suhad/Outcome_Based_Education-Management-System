package com.shohaib.core.domain.repository;

import com.shohaib.core.domain.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByStudentId(String studentId);
    List<Student> findByDepartmentId(Long departmentId);
    boolean existsByStudentId(String studentId);
}
