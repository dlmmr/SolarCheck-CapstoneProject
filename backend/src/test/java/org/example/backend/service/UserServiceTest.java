package org.example.backend.service;

import org.example.backend.model.*;
import org.example.backend.repo.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // ✅ generateUser
    @Test
    void generateUser_shouldSaveUserWithRandomId() {
        // Given
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // When
        User result = userService.generateUser();

        // Then
        assertNotNull(result.userId());
        verify(userRepository).save(any(User.class));
    }

    // ✅ updateUserinfo
    @Test
    void updateUserinfo_shouldReplaceUserInfo() {
        // Given
        User existing = new User("1", null, new UserConditions(true, 30, Direction.SOUTH, 0.2), null);
        when(userRepository.findById("1")).thenReturn(Optional.of(existing));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserInfo newInfo = new UserInfo(30, 2, 4000);

        // When
        User updated = userService.updateUserinfo("1", newInfo);

        // Then
        assertEquals(newInfo, updated.userInfo());
        assertEquals(existing.userConditions(), updated.userConditions());
    }

    @Test
    void updateUserinfo_shouldThrowIfUserNotFound() {
        // Given
        when(userRepository.findById("999")).thenReturn(Optional.empty());
        UserInfo newInfo = new UserInfo(30, 2, 4000);

        // When / Then
        assertThrows(IllegalArgumentException.class, () -> userService.updateUserinfo("999", newInfo));
    }

    // ✅ updateUserConditions
    @Test
    void updateUserConditions_shouldSetConditions() {
        // Given
        User existing = new User("1", null, null, null);
        UserConditions conditions = new UserConditions(true, 30, Direction.SOUTH, 0.3);

        when(userRepository.findById("1")).thenReturn(Optional.of(existing));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        User updated = userService.updateUserConditions("1", conditions);

        // Then
        assertEquals(conditions, updated.userConditions());
        verify(userRepository).save(updated);
    }

    @Test
    void updateUserConditions_shouldThrowIfUserNotFound() {
        // Given
        UserConditions conditions = new UserConditions(true, 30, Direction.SOUTH, 0.3);
        when(userRepository.findById("999")).thenReturn(Optional.empty());

        // When // Then
        assertThrows(IllegalArgumentException.class,
                () -> userService.updateUserConditions("999", conditions));
    }


    // ✅ calculateUserResult
    @Test
    void calculateUserResult_shouldCalculateBasedOnConditions() {
        // Given
        UserConditions conditions = new UserConditions(true, 30, Direction.SOUTH, 0.0);
        User user = new User("1", null, conditions, null);

        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        User updated = userService.calculateUserResult("1");

        // Then
        assertNotNull(updated.userResult());
        assertTrue(updated.userResult().userPossibleElectricityGeneration() > 0);
    }

    // ✅ Extremfall #1 – max Schatten → 0 Ertrag
    @Test
    void calculateUserResult_shouldReturnZeroYieldWhenFullShade() {
        // Given
        UserConditions conditions = new UserConditions(true, 30, Direction.NORTH, 1.0);
        User user = new User("1", null, conditions, null);

        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        User updated = userService.calculateUserResult("1");

        // Then
        assertEquals(0, updated.userResult().userPossibleElectricityGeneration());
        assertEquals(0, updated.userResult().userAmountofPossibleSavings());
        assertEquals(9999, updated.userResult().userAmortisationTime());
    }

    // ✅ Extremfall #2 – falscher Angle → Korrektur greift
    @Test
    void calculateUserResult_shouldCorrectOutOfBoundsAngle() {
        // Given
        UserConditions conditions = new UserConditions(true, -10, Direction.SOUTH, 0.0);
        User user = new User("1", null, conditions, null);

        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        User updated = userService.calculateUserResult("1");

        // Then
        assertTrue(updated.userResult().userPossibleElectricityGeneration() > 0);
    }

    @Test
    void calculateUserResult_shouldThrowWhenNoConditionsSet() {
        // Given
        User user = new User("1", null, null, null);
        when(userRepository.findById("1")).thenReturn(Optional.of(user));

        // When / Then
        assertThrows(IllegalStateException.class, () -> userService.calculateUserResult("1"));
    }

    @Test
    void calculateUserResult_shouldThrowWhenUserNotFound() {
        // Given
        when(userRepository.findById("999")).thenReturn(Optional.empty());

        // When / Then
        assertThrows(IllegalArgumentException.class, () -> userService.calculateUserResult("999"));
    }
}
