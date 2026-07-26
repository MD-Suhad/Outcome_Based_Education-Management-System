package com.shohaib.core.service;

import com.shohaib.core.api.dto.BulkUploadResultDTO;
import com.shohaib.core.api.dto.StudentDTO;
import com.shohaib.core.domain.model.Department;
import com.shohaib.core.domain.model.Student;
import com.shohaib.core.domain.repository.DepartmentRepository;
import com.shohaib.core.domain.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentBulkUploadService {

    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;

    public List<StudentDTO> getAllStudents(Long departmentId) {
        if (departmentId != null) {
            return studentRepository.findByDepartmentId(departmentId).stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        }
        return studentRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public BulkUploadResultDTO processExcelBulkUpload(MultipartFile file, Long departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + departmentId));

        BulkUploadResultDTO result = new BulkUploadResultDTO();
        List<Student> studentsToSave = new ArrayList<>();

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();

            int rowNumber = 0;
            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                rowNumber++;

                // Skip header row
                if (rowNumber == 1) {
                    continue;
                }

                String studentId = getCellValueAsString(row.getCell(0));
                String name = getCellValueAsString(row.getCell(1));
                String email = getCellValueAsString(row.getCell(2));
                String session = getCellValueAsString(row.getCell(3));

                // Check empty row boundary
                if ((studentId == null || studentId.isBlank()) && (name == null || name.isBlank())) {
                    continue;
                }

                result.setTotalRowsProcessed(result.getTotalRowsProcessed() + 1);

                // Row validations
                if (studentId == null || studentId.isBlank()) {
                    result.getErrors().add(new BulkUploadResultDTO.RowError(rowNumber, studentId, "Student Roll/ID is required."));
                    result.setFailureCount(result.getFailureCount() + 1);
                    continue;
                }

                if (name == null || name.isBlank()) {
                    result.getErrors().add(new BulkUploadResultDTO.RowError(rowNumber, studentId, "Student Name is required."));
                    result.setFailureCount(result.getFailureCount() + 1);
                    continue;
                }

                if (email == null || !email.contains("@")) {
                    result.getErrors().add(new BulkUploadResultDTO.RowError(rowNumber, studentId, "Valid Email address is required."));
                    result.setFailureCount(result.getFailureCount() + 1);
                    continue;
                }

                if (studentRepository.existsByStudentId(studentId.trim())) {
                    result.getErrors().add(new BulkUploadResultDTO.RowError(rowNumber, studentId, "Student ID " + studentId + " already exists in database."));
                    result.setFailureCount(result.getFailureCount() + 1);
                    continue;
                }

                Student student = new Student();
                student.setStudentId(studentId.trim());
                student.setName(name.trim());
                student.setEmail(email.trim());
                student.setSession(session != null ? session.trim() : "");
                student.setDepartment(department);

                studentsToSave.add(student);
                result.setSuccessCount(result.getSuccessCount() + 1);
            }

            if (!studentsToSave.isEmpty()) {
                studentRepository.saveAll(studentsToSave);
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to process Excel file: " + e.getMessage(), e);
        }

        return result;
    }

    public byte[] generateExcelTemplate() {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Students Template");

            // Header Style
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            Row headerRow = sheet.createRow(0);
            String[] columns = {"Student Roll/ID *", "Full Name *", "Email *", "Batch/Session"};

            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
                sheet.setColumnWidth(i, 6000);
            }

            // Sample Row 1
            Row sampleRow1 = sheet.createRow(1);
            sampleRow1.createCell(0).setCellValue("2023-CS-001");
            sampleRow1.createCell(1).setCellValue("John Doe");
            sampleRow1.createCell(2).setCellValue("john.doe@university.edu");
            sampleRow1.createCell(3).setCellValue("2023-2027");

            // Sample Row 2
            Row sampleRow2 = sheet.createRow(2);
            sampleRow2.createCell(0).setCellValue("2023-CS-002");
            sampleRow2.createCell(1).setCellValue("Jane Smith");
            sampleRow2.createCell(2).setCellValue("jane.smith@university.edu");
            sampleRow2.createCell(3).setCellValue("2023-2027");

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Excel template: " + e.getMessage(), e);
        }
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                }
                return String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return "";
        }
    }

    private StudentDTO mapToDTO(Student student) {
        return StudentDTO.builder()
                .id(student.getId())
                .studentId(student.getStudentId())
                .name(student.getName())
                .email(student.getEmail())
                .session(student.getSession())
                .departmentId(student.getDepartment() != null ? student.getDepartment().getId() : null)
                .departmentName(student.getDepartment() != null ? student.getDepartment().getName() : null)
                .build();
    }
}
