package com.shohaib.objectbasedoutcome.domain.repository;

import com.shohaib.core.domain.repository.CrudRepository;
import com.shohaib.objectbasedoutcome.domain.model.PasswordResets;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetRepository extends CrudRepository<PasswordResets,Long> {
    @Query("select  e from #{#entityName} e where e.token =?1 and e.deleted =false")
    Optional<PasswordResets> findByToken(String token);
}
