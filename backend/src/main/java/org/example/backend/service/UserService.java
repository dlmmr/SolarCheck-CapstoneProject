package org.example.backend.service;

import org.example.backend.model.User;
import org.example.backend.model.UserInfo;
import org.example.backend.repo.UserRepository;
import org.springframework.stereotype.Service;

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

    public UserInfo generateUserinfo() {
        return null;
    }
}
