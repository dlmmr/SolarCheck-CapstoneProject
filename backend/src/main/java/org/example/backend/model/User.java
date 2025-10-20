package org.example.backend.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document
public record User(
        String id,
        UserInfo userInfo,
        UserConditions userConditions,
        UserResult userResult
) {
}
