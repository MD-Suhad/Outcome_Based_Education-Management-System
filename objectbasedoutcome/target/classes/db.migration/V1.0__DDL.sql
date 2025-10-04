CREATE TABLE `user`
(
    `id`             bigint(20)                                                    NOT NULL AUTO_INCREMENT,
    `created_at`     timestamp                                                     NOT NULL,
    `deleted`        tinyint(1)                                                             DEFAULT '0',
    `updated_at`     timestamp NULL     DEFAULT NULL,
    `email`          varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    `email_verified` tinyint(1)                                                    NOT NULL DEFAULT '0',
    `first_name`     varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    `ip_address`     varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
    `last_name`      varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    `password`       varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    `profile_image`  varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
    `phone_number`   varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
    `address`        varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
    `username`       varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci  NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `UK_sb8bbouer5wak8vyiiy4pf2bx` (`username`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 2
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;


CREATE TABLE `permission`
(
    `id`         bigint(20)                                                   NOT NULL AUTO_INCREMENT,
    `created_at` timestamp                                                    NOT NULL,
    `deleted`    tinyint(1)                                                        DEFAULT '0',
    `updated_at` timestamp NULL DEFAULT NULL,
    `title`      varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 7
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

CREATE TABLE `user_permission`
(
    `id`            bigint(20) NOT NULL AUTO_INCREMENT,
    `created_at`    timestamp NOT NULL,
    `deleted`       tinyint(1)      DEFAULT '0',
    `updated_at`    timestamp NULL DEFAULT NULL,
    `permission_id` bigint(20)      DEFAULT NULL,
    `user_id`       bigint(20)      DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY             `FKbklmo9kchans5u3e4va0ouo1s` (`permission_id`),
    KEY             `FK7c2x74rinbtf33lhdcyob20sh` (`user_id`),
    CONSTRAINT `FK7c2x74rinbtf33lhdcyob20sh` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
    CONSTRAINT `FKbklmo9kchans5u3e4va0ouo1s` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 2
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

CREATE TABLE `role_management`
(
    `id`                 bigint(20) NOT NULL AUTO_INCREMENT,
    `created_at`         timestamp NOT NULL,
    `deleted`            tinyint(1)      DEFAULT '0',
    `updated_at`         timestamp NULL DEFAULT NULL,
    `user_permission_id` bigint(20)      DEFAULT NULL,
    `active`             bool default false,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 2
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

CREATE TABLE `role_management_tracker`
(
    `id`                 bigint(20) NOT NULL AUTO_INCREMENT,
    `role_management_id` bigint(20) DEFAULT NULL,
    `date`               date         DEFAULT NULL,
    `status`             varchar(255) DEFAULT NULL,
    `created_at`         timestamp NOT NULL,
    `deleted`            tinyint(1)      DEFAULT '0',
    `updated_at`         timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 2
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;






CREATE TABLE `email_verification_token`
(
    `id`          bigint(20)                                                    NOT NULL AUTO_INCREMENT,
    `expiry_date` datetime                                                      NOT NULL,
    `token`       varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    `user_id`     bigint(20) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY           `FKqmvt3qcly3hbvde97srchdo3x` (`user_id`),
    CONSTRAINT `FKqmvt3qcly3hbvde97srchdo3x` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;


CREATE TABLE `password_resets`
(
    `id`          bigint(20)                                                    NOT NULL AUTO_INCREMENT,
    `created_at`  timestamp                                                     NOT NULL,
    `deleted`     tinyint(1)                                                         DEFAULT '0',
    `updated_at`  timestamp NULL DEFAULT NULL,
    `email`       varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    `expiry_date` datetime                                                      NOT NULL,
    `token`       varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

CREATE TABLE `employee`
(
    `id`                      bigint(20)   NOT NULL AUTO_INCREMENT,
    `user_id`                 bigint(20)        DEFAULT NULL,
    `user_name`               varchar(255) DEFAULT NULL,
    `employee_id`             varchar(255) DEFAULT NULL,
    `employee_type`           varchar(255) DEFAULT NULL,
    `employment_type`         varchar(255) DEFAULT NULL,
    `designation_id`          bigint(20)        DEFAULT NULL,
    `designation`             varchar(250) DEFAULT NULL,
    `job_position_id`         bigint(20)        DEFAULT NULL,
    `job_position`            varchar(250) DEFAULT NULL,
    `job_grade_id`            bigint(20)        DEFAULT NULL,
    `job_grade_name`          varchar(250) DEFAULT NULL,
    `job_grade_payment_stage` int(10)           DEFAULT NULL,
    `number_of_babies`        int(10)           DEFAULT 0,
    `faculty_id`              bigint(25)        DEFAULT NULL,
    `faculty`                 varchar(250) DEFAULT NULL,
    `department`              varchar(250) DEFAULT NULL,
    `department_id`           bigint(25)        DEFAULT NULL,
    `department_type`         varchar(255) DEFAULT NULL,
    `biography`               text         DEFAULT NULL,
    `start_date`              datetime     DEFAULT NULL,
    `end_date`                datetime     DEFAULT NULL,
    `status`                  varchar(200) NULL DEFAULT 'active',
    `gender`                  varchar(255) DEFAULT NULL,
    `blood_group`             varchar(255) DEFAULT NULL,
    `marital_status`          varchar(255) DEFAULT NULL,
    `date_of_birth`           datetime     DEFAULT NULL,
    `religion`                varchar(255) DEFAULT NULL,
    `nationality`             varchar(255) DEFAULT NULL,
    `nid`                     varchar(255) DEFAULT NULL,
    `passport_no`             varchar(255) DEFAULT NULL,
    `permanent_address`       varchar(255) DEFAULT NULL,
    `social_network_id`       varchar(255) DEFAULT NULL,
    `bank_account_number`     varchar(255) DEFAULT NULL,
    `hold_salary`             bool         default null,
    `hold_salary_increment`   bool         default null,
    `hold_salary_documents`   varchar(255) DEFAULT NULL,
    `hold_salary_comments`    varchar(255) DEFAULT NULL,
    `retirement`              bool         default null,
    `salary_id`               varchar(255) DEFAULT NULL,
    `created_at`              timestamp    DEFAULT NULL,
    `deleted`                 tinyint(1)        DEFAULT '0',
    `updated_at`              timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;













