package org.example.backend.controller;

import org.example.backend.model.User;
import org.example.backend.model.UserInfo;
import org.example.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

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

    // PUT: Aktualisiert die UserInfo
    @PutMapping("/{userId}/info")
    public User updateUserInfo(@PathVariable String userId, @RequestBody UserInfo userInfo) {
        return userService.updateUserInfo(userId, userInfo);
    }
}
