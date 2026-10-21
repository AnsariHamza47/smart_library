package com.smartlibrary;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Entry Point for Smart Library Management System.
 * College Mini Project - Experiment 10.
 *
 * Technologies:
 * - Spring Boot 3.2
 * - Spring Data JPA & Hibernate
 * - Spring Security 6 & JWT
 * - MySQL Relational Database
 */
@SpringBootApplication
public class LibraryApplication {

    public static void main(String[] args) {
        SpringApplication.run(LibraryApplication.class, args);
        System.out.println("==================================================================");
        System.out.println(" SMART LIBRARY MANAGEMENT SYSTEM BACKEND STARTED SUCCESSFULLY");
        System.out.println(" REST API URL: http://localhost:8080/api");
        System.out.println(" MySQL Database: jdbc:mysql://localhost:3306/library_db");
        System.out.println("==================================================================");
    }
}
