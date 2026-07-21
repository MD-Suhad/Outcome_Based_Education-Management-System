package com.shohaib.core.domain.repository;

import com.shohaib.core.domain.model.ProgramOutcome;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramOutcomeRepository extends CrudRepository<ProgramOutcome, Long> {
}
