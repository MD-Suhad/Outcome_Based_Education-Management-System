package com.shohaib.objectbasedoutcome.domain.model;

import com.shohaib.core.domain.model.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.Accessors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailDetails  {
    private String[] recipient;
    private String msgBody;
    private String subject;
    private String attachment;
}
