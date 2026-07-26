package com.shohaib.core.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {
    private Long id;
    private String studentId;
    private String name;
    private String email;
    private String session;
    private Long departmentId;
    private String departmentName;
}
