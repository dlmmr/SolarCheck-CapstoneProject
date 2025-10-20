package org.example.backend.controller;

import org.example.backend.model.User;
import org.example.backend.model.UserInfo;
import org.example.backend.service.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/home")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public User generateUser() {
        return userService.generateUser();
    }

    @PostMapping("/userinfo")
    public UserInfo generateUserInfo() {return userService.generateUserinfo();
    }
}
