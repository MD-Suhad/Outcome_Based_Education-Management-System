package com.shohaib.core.service;

import com.shohaib.core.api.dto.DepartmentDTO;
import com.shohaib.core.domain.model.Department;
import com.shohaib.core.domain.model.Faculty;
import com.shohaib.core.domain.repository.DepartmentRepository;
import com.shohaib.core.domain.repository.FacultyRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final FacultyRepository facultyRepository;

    @Cacheable(value = "departments", key = "'all'")
    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "departments_faculty", key = "#facultyId")
    public List<DepartmentDTO> getDepartmentsByFaculty(Long facultyId) {
        return departmentRepository.findByFacultyId(facultyId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "department", key = "#id")
    public DepartmentDTO getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + id));
        return mapToDTO(department);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "departments", allEntries = true),
        @CacheEvict(value = "departments_faculty", allEntries = true),
        @CacheEvict(value = "department", key = "#dto.id", condition = "#dto.id != null")
    })
    public DepartmentDTO createDepartment(DepartmentDTO dto) {
        if (departmentRepository.findByCode(dto.getCode()).isPresent()) {
            throw new RuntimeException("Department with code " + dto.getCode() + " already exists.");
        }
        Faculty faculty = null;
        if (dto.getFacultyId() != null) {
            faculty = facultyRepository.findById(dto.getFacultyId())
                    .orElseThrow(() -> new RuntimeException("Faculty not found with ID: " + dto.getFacultyId()));
        }

        Department department = new Department();
        department.setName(dto.getName());
        department.setCode(dto.getCode());
        department.setFaculty(faculty);

        return mapToDTO(departmentRepository.save(department));
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "departments", allEntries = true),
        @CacheEvict(value = "departments_faculty", allEntries = true),
        @CacheEvict(value = "department", key = "#id")
    })
    public DepartmentDTO updateDepartment(Long id, DepartmentDTO dto) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + id));

        if (dto.getFacultyId() != null) {
            Faculty faculty = facultyRepository.findById(dto.getFacultyId())
                    .orElseThrow(() -> new RuntimeException("Faculty not found with ID: " + dto.getFacultyId()));
            department.setFaculty(faculty);
        }

        department.setName(dto.getName());
        return mapToDTO(departmentRepository.save(department));
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "departments", allEntries = true),
        @CacheEvict(value = "departments_faculty", allEntries = true),
        @CacheEvict(value = "department", key = "#id")
    })
    public void deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
    }

    private DepartmentDTO mapToDTO(Department dept) {
        return DepartmentDTO.builder()
                .id(dept.getId())
                .name(dept.getName())
                .code(dept.getCode())
                .facultyId(dept.getFaculty() != null ? dept.getFaculty().getId() : null)
                .facultyName(dept.getFaculty() != null ? dept.getFaculty().getName() : null)
                .build();
    }
}
