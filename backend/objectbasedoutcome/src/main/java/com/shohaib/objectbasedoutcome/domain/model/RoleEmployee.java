package com.shohaib.objectbasedoutcome.domain.model;

import com.shohaib.core.domain.model.BaseEntity;
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
public class RoleEmployee extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne
	private User user;
	@ManyToOne
	private Employee employee;
}
