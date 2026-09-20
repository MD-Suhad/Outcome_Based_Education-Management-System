package com.shohaib.objectbasedoutcome.service.ai;

import com.shohaib.objectbasedoutcome.dto.ai.AiAnalysisRequest;
import com.shohaib.objectbasedoutcome.dto.ai.AiAnalysisResponse;

public interface AiAssistantService {
    AiAnalysisResponse analyzeSyllabusAndRecommendMappings(AiAnalysisRequest request);
}
