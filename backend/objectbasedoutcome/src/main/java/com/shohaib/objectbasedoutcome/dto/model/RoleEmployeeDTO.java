package com.shohaib.objectbasedoutcome.dto.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Accessors(chain = true)
public class RoleEmployeeDTO {
    private Long id;
    private Long userId;
    private Long employeeId;
}
