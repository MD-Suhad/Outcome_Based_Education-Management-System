package com.shohaib.objectbasedoutcome.domain.repository;


import com.shohaib.objectbasedoutcome.domain.model.User;
import jakarta.persistence.Id;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Id> {

    Optional<User> findByUsername(String username);
    Optional<User> findByUsernameAndDeletedFalse(String username);

}
