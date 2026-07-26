package com.shohaib.core.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkUploadResultDTO {
    private int totalRowsProcessed;
    private int successCount;
    private int failureCount;
    @Builder.Default
    private List<RowError> errors = new ArrayList<>();

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RowError {
        private int rowNumber;
        private String studentId;
        private String errorMessage;
    }
}
