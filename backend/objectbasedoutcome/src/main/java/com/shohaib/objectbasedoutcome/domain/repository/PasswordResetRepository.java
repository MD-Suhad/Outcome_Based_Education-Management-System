package com.shohaib.objectbasedoutcome.domain.repository;

import com.shohaib.core.domain.repository.CrudRepository;
import com.shohaib.objectbasedoutcome.domain.model.PasswordResets;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordResetRepository extends CrudRepository<PasswordResets,Long> {
}
