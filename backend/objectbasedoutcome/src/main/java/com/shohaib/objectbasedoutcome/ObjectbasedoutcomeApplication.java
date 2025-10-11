package com.shohaib.objectbasedoutcome;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;

@EnableEurekaClient
@SpringBootApplication
@EnableFeignClients
@ComponentScan(basePackages = {"com.shohaib.objectbasedoutcome", "com.shohaib.core"})
public class ObjectbasedoutcomeApplication {

	public static void main(String[] args) {
		SpringApplication.run(ObjectbasedoutcomeApplication.class, args);
	}
}
