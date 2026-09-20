package com.shohaib.objectbasedoutcome.api.v1.controller;

import com.shohaib.objectbasedoutcome.dto.ai.AiAnalysisRequest;
import com.shohaib.objectbasedoutcome.dto.ai.AiAnalysisResponse;
import com.shohaib.objectbasedoutcome.service.ai.AiAssistantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AiAssistantController {

    private final AiAssistantService aiAssistantService;

    @PostMapping("/analyze-syllabus")
    public ResponseEntity<AiAnalysisResponse> analyzeSyllabus(@Valid @RequestBody AiAnalysisRequest request) {
        AiAnalysisResponse response = aiAssistantService.analyzeSyllabusAndRecommendMappings(request);
        return ResponseEntity.ok(response);
    }
}
