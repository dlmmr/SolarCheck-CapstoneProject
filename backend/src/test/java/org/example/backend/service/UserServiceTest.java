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

    // ===================================
    // generateUser Tests
    // ===================================

    @Test
    void generateUser_shouldSaveUserWithRandomId() {
        // Given
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // When
        User result = userService.generateUser();

        // Then
        assertNotNull(result.userId());
        assertNull(result.userInfo());
        assertNull(result.userConditions());
        assertNull(result.userResult());
        verify(userRepository).save(any(User.class));
    }

    // ===================================
    // updateUserinfo Tests
    // ===================================

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
        verify(userRepository).save(updated);
    }

    @Test
    void updateUserinfo_shouldThrowIfUserNotFound() {
        // Given
        when(userRepository.findById("999")).thenReturn(Optional.empty());
        UserInfo newInfo = new UserInfo(30, 2, 4000);

        // When / Then
        assertThrows(IllegalArgumentException.class, () -> userService.updateUserinfo("999", newInfo));
    }

    // ===================================
    // updateUserConditions Tests
    // ===================================

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

        // When / Then
        assertThrows(IllegalArgumentException.class,
                () -> userService.updateUserConditions("999", conditions));
    }

    // ===================================
    // calculateUserResult Tests
    // ===================================

    @Test
    void calculateUserResult_shouldCalculateBasedOnConditions() {
        // Given - FIXED: Added UserInfo
        UserInfo info = new UserInfo(30, 2, 4000);  // 30 cents/kWh
        UserConditions conditions = new UserConditions(true, 30, Direction.SOUTH, 0.0);
        User user = new User("1", info, conditions, null);

        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        User updated = userService.calculateUserResult("1");

        // Then
        assertNotNull(updated.userResult());
        assertTrue(updated.userResult().userPossibleElectricityGeneration() > 0);
        assertTrue(updated.userResult().userAmountofPossibleSavings() > 0);
        assertTrue(updated.userResult().userAmortisationTime() > 0);
    }

    @Test
    void calculateUserResult_shouldReturnZeroYieldWhenFullShade() {
        // Given - FIXED: Added UserInfo
        UserInfo info = new UserInfo(30, 2, 4000);
        UserConditions conditions = new UserConditions(true, 30, Direction.NORTH, 1.0);
        User user = new User("1", info, conditions, null);

        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        User updated = userService.calculateUserResult("1");

        // Then
        assertEquals(0, updated.userResult().userPossibleElectricityGeneration());
        assertEquals(0, updated.userResult().userAmountofPossibleSavings());
        // FIXED: Changed from 9999 to Integer.MAX_VALUE
        assertEquals(Integer.MAX_VALUE, updated.userResult().userAmortisationTime());
    }

    @Test
    void calculateUserResult_shouldCorrectOutOfBoundsAngle() {
        // Given - FIXED: Added UserInfo
        UserInfo info = new UserInfo(30, 2, 4000);
        UserConditions conditions = new UserConditions(true, -10, Direction.SOUTH, 0.0);
        User user = new User("1", info, conditions, null);

        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        User updated = userService.calculateUserResult("1");

        // Then - angle -10 gets clamped to 0, still produces some yield
        assertTrue(updated.userResult().userPossibleElectricityGeneration() > 0);
    }

    // ===================================
    // NEW: Tests for Nullable Fields
    // ===================================

    @Test
    void calculateUserResult_shouldUseDefaultAngleWhenNull() {
        // Given - montageAngle is null
        UserInfo info = new UserInfo(30, 2, 4000);
        UserConditions conditions = new UserConditions(true, null, Direction.SOUTH, 0.0);
        User user = new User("1", info, conditions, null);

        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        User updated = userService.calculateUserResult("1");

        // Then - should use default angle (30°) and produce optimal yield
        assertTrue(updated.userResult().userPossibleElectricityGeneration() > 0);
        assertEquals(800, updated.userResult().userPossibleElectricityGeneration()); // 0.8 * 1.0 * 1.0 * 1.0 * 1000 = 800
    }

    @Test
    void calculateUserResult_shouldUseDefaultShadeFactorWhenNull() {
        // Given - montageShadeFactor is null
        UserInfo info = new UserInfo(30, 2, 4000);
        UserConditions conditions = new UserConditions(true, 30, Direction.SOUTH, null);
        User user = new User("1", info, conditions, null);

        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        User updated = userService.calculateUserResult("1");

        // Then - should use default shade factor (0.0) meaning no shade
        assertTrue(updated.userResult().userPossibleElectricityGeneration() > 0);
        assertEquals(800, updated.userResult().userPossibleElectricityGeneration());
    }

    @Test
    void calculateUserResult_shouldHandleBothNullableFields() {
        // Given - both nullable fields are null
        UserInfo info = new UserInfo(30, 2, 4000);
        UserConditions conditions = new UserConditions(true, null, Direction.SOUTH, null);
        User user = new User("1", info, conditions, null);

        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        User updated = userService.calculateUserResult("1");

        // Then - should use both defaults (angle=30°, shade=0.0)
        assertNotNull(updated.userResult());
        assertEquals(800, updated.userResult().userPossibleElectricityGeneration());
        assertEquals(240, updated.userResult().userAmountofPossibleSavings()); // 800 * 0.30 = 240
    }

    // ===================================
    // Error Cases
    // ===================================

    @Test
    void calculateUserResult_shouldThrowWhenNoConditionsSet() {
        // Given - UserInfo exists but UserConditions is null
        UserInfo info = new UserInfo(30, 2, 4000);
        User user = new User("1", info, null, null);
        when(userRepository.findById("1")).thenReturn(Optional.of(user));

        // When / Then
        assertThrows(IllegalStateException.class, () -> userService.calculateUserResult("1"));
    }

    @Test
    void calculateUserResult_shouldThrowWhenNoUserInfoSet() {
        // Given - UserConditions exists but UserInfo is null
        UserConditions conditions = new UserConditions(true, 30, Direction.SOUTH, 0.0);
        User user = new User("1", null, conditions, null);
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

    // ===================================
    // Business Logic Tests
    // ===================================

    @Test
    void calculateUserResult_shouldCalculateSavingsCorrectly() {
        // Given - 40 cents/kWh electricity rate
        UserInfo info = new UserInfo(40, 2, 4000);
        UserConditions conditions = new UserConditions(true, 30, Direction.SOUTH, 0.0);
        User user = new User("1", info, conditions, null);

        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        User updated = userService.calculateUserResult("1");

        // Then - 800 kWh * 0.40 EUR/kWh = 320 EUR savings
        assertEquals(800, updated.userResult().userPossibleElectricityGeneration());
        assertEquals(320, updated.userResult().userAmountofPossibleSavings());
        // 1000 EUR cost / 320 EUR savings = 3.125 → rounds up to 4 years
        assertEquals(4, updated.userResult().userAmortisationTime());
    }

    @Test
    void calculateUserResult_shouldHandleDifferentDirections() {
        // Given - EAST direction (factor 0.8)
        UserInfo info = new UserInfo(30, 2, 4000);
        UserConditions conditions = new UserConditions(true, 30, Direction.EAST, 0.0);
        User user = new User("1", info, conditions, null);

        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        User updated = userService.calculateUserResult("1");

        // Then - 0.8 * 0.8 * 1.0 * 1.0 * 1000 = 640 kWh
        assertEquals(640, updated.userResult().userPossibleElectricityGeneration());
    }
}