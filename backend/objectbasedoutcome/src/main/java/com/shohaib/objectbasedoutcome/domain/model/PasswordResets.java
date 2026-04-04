package com.shohaib.objectbasedoutcome.domain.model;

import com.shohaib.core.domain.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.Date;

@Entity
@Getter
@Setter
@Accessors(chain = true)
public class PasswordResets extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "VARCHAR(128)")
    private String email;

    @Column(nullable = false, columnDefinition = "VARCHAR(256)")
    private String token;

    @Column(nullable = false, columnDefinition = "DATETIME")
    private Date expiryDate;

}
