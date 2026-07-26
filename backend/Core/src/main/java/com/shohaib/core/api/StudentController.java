package com.shohaib.core.api;

import com.shohaib.core.api.dto.BulkUploadResultDTO;
import com.shohaib.core.api.dto.StudentDTO;
import com.shohaib.core.service.StudentBulkUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentBulkUploadService studentBulkUploadService;

    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAllStudents(@RequestParam(required = false) Long departmentId) {
        return ResponseEntity.ok(studentBulkUploadService.getAllStudents(departmentId));
    }

    @PostMapping("/bulk-upload")
    public ResponseEntity<BulkUploadResultDTO> bulkUploadStudents(
            @RequestParam("file") MultipartFile file,
            @RequestParam("departmentId") Long departmentId) {
        BulkUploadResultDTO result = studentBulkUploadService.processExcelBulkUpload(file, departmentId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/excel-template")
    public ResponseEntity<byte[]> downloadTemplate() {
        byte[] excelBytes = studentBulkUploadService.generateExcelTemplate();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=student_upload_template.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelBytes);
    }
}
