package com.sarth.notesapp.service;

import com.sarth.notesapp.model.User;
import com.sarth.notesapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(String username, String rawPassword){
        String hashedPassword = passwordEncoder.encode(rawPassword);
        User user = new User(username, hashedPassword,"ROLE_USER");
        return userRepository.save(user);
    }
}
