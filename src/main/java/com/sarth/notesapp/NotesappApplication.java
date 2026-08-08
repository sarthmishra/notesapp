package com.sarth.notesapp;

import com.sarth.notesapp.model.User;
import com.sarth.notesapp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class NotesappApplication {

	public static void main(String[] args) {
		SpringApplication.run(NotesappApplication.class, args);
	}

	@Bean
    CommandLineRunner createAdminUser(
			UserRepository userRepository,
			PasswordEncoder passwordEncoder) {

		return args -> {

			if (userRepository.findByUsername("admin").isEmpty()) {

				User admin = new User(
						"admin",
						passwordEncoder.encode("admin123"),
						"ROLE_ADMIN"
				);

				userRepository.save(admin);
			}
		};
	}
}
