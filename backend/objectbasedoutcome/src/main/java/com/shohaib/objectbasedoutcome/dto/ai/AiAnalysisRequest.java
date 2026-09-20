package com.shohaib.objectbasedoutcome.dto.ai;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiAnalysisRequest {

    @NotBlank(message = "Syllabus text cannot be empty")
    @Size(min = 10, max = 5000, message = "Syllabus text length must be between 10 and 5000 characters")
    private String syllabusText;

    private String courseCode;
    private String programCode;
}
