package org.example.backend.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document
public record User(
        UserInfo userInfo,
        UserConditions userConditions,
        UserResult userResult
) {
}
