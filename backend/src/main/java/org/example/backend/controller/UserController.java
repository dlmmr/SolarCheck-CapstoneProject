package org.example.backend.controller;

import jakarta.validation.Valid;
import org.example.backend.dto.UserConditionsDTO;
import org.example.backend.dto.UserInfoDTO;
import org.example.backend.dto.UserResponseDTO;
import org.example.backend.mapper.UserMapper;
import org.example.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/home")
public class UserController {

    private final UserService userService;
    private final UserMapper mapper;

    public UserController(UserService userService, UserMapper mapper) {
        this.userService = userService;
        this.mapper = mapper;
    }

    @PostMapping
    public UserResponseDTO generateUser() {
        return mapper.toUserResponseDTO(userService.generateUser());
    }

    @PutMapping("/{userId}/info")
    public UserResponseDTO updateUserinfo(
            @PathVariable String userId,
            @Valid @RequestBody UserInfoDTO dto) {

        return mapper.toUserResponseDTO(
                userService.updateUserinfo(
                        userId,
                        mapper.toUserInfo(dto)
                )
        );
    }

    @PutMapping("/{userId}/conditions")
    public UserResponseDTO updateUserConditions(
            @PathVariable String userId,
            @Valid @RequestBody UserConditionsDTO dto) {

        return mapper.toUserResponseDTO(
                userService.updateUserConditions(
                        userId,
                        mapper.toUserConditions(dto)
                )
        );
    }

    @PostMapping("/{userId}/result")
    public UserResponseDTO calculateUserResult(@PathVariable String userId) {
        return mapper.toUserResponseDTO(userService.calculateUserResult(userId));
    }
}
