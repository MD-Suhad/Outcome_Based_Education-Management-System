package com.shohaib.objectbasedoutcome.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoPoRecommendationDto {
    private String coCode;               // e.g. "CO1"
    private String coStatement;          // e.g. "Analyze software requirements and design modern scalable architectures"
    private String bloomsTaxonomy;       // e.g. "C4 - Analysis"
    private String recommendedPlo;       // e.g. "PLO-1: Engineering Knowledge"
    private Integer recommendedWeight;   // 1 (Low), 2 (Medium), 3 (High)
    private Integer confidenceScore;     // 0 to 100 percentage
    private String rationale;            // Explanation of why this mapping & weight were chosen
}
