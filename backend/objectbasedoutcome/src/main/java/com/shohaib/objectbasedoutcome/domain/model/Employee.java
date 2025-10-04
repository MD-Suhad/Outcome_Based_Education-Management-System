package com.shohaib.objectbasedoutcome.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
@Entity
public class Employee extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private Long userId;
	private String userName;
	private String employeeId;
	private String employeeType;
	private String employmentType;
	private Long designationId;
	private String designation;
	private Long jobPositionId;
	private String jobPosition;
	private String faculty;
	private Long facultyId;
	private Long departmentId;
	private String department;
	private String departmentType;
	@Column(columnDefinition = "TEXT")
	private String biography;
	private String gender;
	private Date dateOfBirth;
	private String blood_group;
	private String religion ;
	private String marital_status;
	private String nationality;
	private String nid;
	private String passport_no;
	private String permanent_address;
	private String social_network_id;
	private Date startDate;
	private Date endDate;
	private String status;
	private String bankAccountNumber;
	private Long jobGradeId;
	private String jobGradeName;
	private int jobGradePaymentStage;
	private int numberOfBabies;
	private boolean holdSalary;
	private boolean holdSalaryIncrement;
	private String holdSalaryDocuments;
	private String holdSalaryComments;
	private boolean retirement;
	private String salaryId;

}
