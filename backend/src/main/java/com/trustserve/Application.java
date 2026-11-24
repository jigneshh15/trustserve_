package com.trustserve;
import org.springframework.boot.*;import org.springframework.boot.autoconfigure.*;import org.springframework.scheduling.annotation.EnableAsync;
@SpringBootApplication @EnableAsync public class Application {public static void main(String[] args){SpringApplication.run(Application.class,args);}}
