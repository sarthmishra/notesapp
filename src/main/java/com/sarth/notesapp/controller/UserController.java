package com.sarth.notesapp.controller;

import com.sarth.notesapp.model.User;
import com.sarth.notesapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String register(@RequestBody User user){
        userService.registerUser(user.getUsername(),user.getPassword());
        return "User registered Successfully";
    }
}
