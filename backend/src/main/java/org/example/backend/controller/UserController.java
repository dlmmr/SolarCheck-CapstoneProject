package org.example.backend.controller;

import org.example.backend.model.User;
import org.example.backend.model.UserConditions;
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

    @PutMapping("/{userId}/info")
    public User updateUserinfo(@PathVariable String userId, @RequestBody UserInfo userInfo) {
        return userService.updateUserinfo(userId, userInfo);
    }
    @PutMapping("/{userId}/conditions")
    public User updateUserConditions(@PathVariable String userId, @RequestBody UserConditions userConditions) {
        return userService.updateUserConditions(userId, userConditions);
    }
    @PostMapping("/{userId}/result")
    public User calculateUserResult(@PathVariable String userId) {
        return userService.calculateUserResult(userId);
    }
}
