package com.shohaib.core.domain.repository;

import com.shohaib.core.domain.model.Course;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends CrudRepository<Course, Long> {
}
