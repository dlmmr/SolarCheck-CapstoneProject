package org.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public record User(

        @Id
        String userId,
        UserInfo userInfo,
        UserConditions userConditions,
        UserResult userResult
) {
}
