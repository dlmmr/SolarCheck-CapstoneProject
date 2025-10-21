package org.example.backend.service;

import org.example.backend.model.User;
import org.example.backend.model.UserConditions;
import org.example.backend.model.UserInfo;
import org.example.backend.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User generateUser() {
        String id = UUID.randomUUID().toString();
        User user = new User(id, null, null, null);
        return userRepository.save(user);
    }

    // aktualisiert UserInfo eines bestehenden Users
    public User updateUserinfo(String userId, UserInfo userInfo) {
        Optional<User> existingUser = userRepository.findById(userId);
        if (existingUser.isEmpty()) {
            throw new IllegalArgumentException("User not found: " + userId);
        }

        User user = existingUser.get();
        User updatedUser = new User(
                user.userId(),
                userInfo,                  // neue Info
                user.userConditions(),     // bleibt gleich
                user.userResult()          // bleibt gleich
        );

        return userRepository.save(updatedUser);
    }

    public User updateUserConditions(String userId, UserConditions userConditions) {
        Optional<User> existingUser = userRepository.findById(userId);
        if (existingUser.isEmpty()) {
            throw new IllegalArgumentException("User not found: " + userId);
        }
        User user = existingUser.get();
        User updatedUser = new User(
        user.userId(),
        user.userInfo(),
        userConditions,
        user.userResult()
        );
        return userRepository.save(updatedUser);
    }
}
