package com.shohaib.core.service;

import com.shohaib.core.api.dto.FacultyDTO;
import com.shohaib.core.domain.model.Faculty;
import com.shohaib.core.domain.repository.FacultyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FacultyService {

    private final FacultyRepository facultyRepository;

    public List<FacultyDTO> getAllFaculties() {
        return facultyRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public FacultyDTO getFacultyById(Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found with ID: " + id));
        return mapToDTO(faculty);
    }

    @Transactional
    public FacultyDTO createFaculty(FacultyDTO dto) {
        if (facultyRepository.findByCode(dto.getCode()).isPresent()) {
            throw new RuntimeException("Faculty with code " + dto.getCode() + " already exists.");
        }
        Faculty faculty = new Faculty();
        faculty.setName(dto.getName());
        faculty.setCode(dto.getCode());
        faculty.setDescription(dto.getDescription());
        Faculty saved = facultyRepository.save(faculty);
        return mapToDTO(saved);
    }

    @Transactional
    public FacultyDTO updateFaculty(Long id, FacultyDTO dto) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found with ID: " + id));
        faculty.setName(dto.getName());
        faculty.setDescription(dto.getDescription());
        return mapToDTO(facultyRepository.save(faculty));
    }

    @Transactional
    public void deleteFaculty(Long id) {
        facultyRepository.deleteById(id);
    }

    private FacultyDTO mapToDTO(Faculty faculty) {
        return FacultyDTO.builder()
                .id(faculty.getId())
                .name(faculty.getName())
                .code(faculty.getCode())
                .description(faculty.getDescription())
                .build();
    }
}
