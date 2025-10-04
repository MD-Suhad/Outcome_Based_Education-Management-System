package com.shohaib.objectbasedoutcome.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;



@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
@Entity
public class RoleManagement extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne
	private UserPermission userPermission;
	private boolean active;
}
