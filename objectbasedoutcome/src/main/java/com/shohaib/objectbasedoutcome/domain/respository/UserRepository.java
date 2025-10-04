package com.shohaib.objectbasedoutcome.domain.respository;

import com.shohaib.objectbasedoutcome.domain.model.User;
import jakarta.persistence.Id;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Id> {
}
