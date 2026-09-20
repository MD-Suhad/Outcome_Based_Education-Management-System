package com.shohaib.objectbasedoutcome.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiAnalysisResponse {
    private String courseCode;
    private int totalOutcomesProcessed;
    private List<CoPoRecommendationDto> suggestions;
    private String status;
    private String modelUsed;
}
