package com.shohaib.objectbasedoutcome.domain.repository;

import com.shohaib.objectbasedoutcome.domain.model.Permission;
import jakarta.persistence.Id;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserPermissionRepository extends CrudRepository<Permission, Id> {
    @Query("select e from #{#entityName} e where e.title='USER'")
    Permission ROLE_USER();


}
