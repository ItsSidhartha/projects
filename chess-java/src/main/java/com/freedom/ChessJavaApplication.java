package com.freedom;

import com.freedom.service.GameService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;

@SpringBootApplication
public class ChessJavaApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChessJavaApplication.class, args);
    }

    @Component
    static class ChessCommandLineRunner implements CommandLineRunner {
        @Override
        public void run(String... args) {
            GameService.play();
        }
    }
}
