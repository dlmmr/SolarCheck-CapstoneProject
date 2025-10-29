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
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.generateUser();

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
        UserConditions existingConditions = new UserConditions(
                UserPvConfig.CHEAP_PV_COMBI, 30, Direction.SOUTH, 0.2
        );
        User existing = new User("1", null, existingConditions, null);
        when(userRepository.findById("1")).thenReturn(Optional.of(existing));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserInfo newInfo = new UserInfo(30, 2, 4000);

        User updated = userService.updateUserinfo("1", newInfo);

        assertEquals(newInfo, updated.userInfo());
        assertEquals(existingConditions, updated.userConditions());
        verify(userRepository).save(updated);
    }

    @Test
    void updateUserinfo_shouldThrowIfUserNotFound() {
        when(userRepository.findById("999")).thenReturn(Optional.empty());
        UserInfo newInfo = new UserInfo(30, 2, 4000);

        assertThrows(IllegalArgumentException.class, () -> userService.updateUserinfo("999", newInfo));
    }

    // ===================================
    // updateUserConditions Tests
    // ===================================
    @Test
    void updateUserConditions_shouldSetConditions() {
        User existing = new User("1", null, null, null);
        UserConditions conditions = new UserConditions(
                UserPvConfig.MEDIUM_PV_COMBI, 30, Direction.SOUTH, 0.3
        );

        when(userRepository.findById("1")).thenReturn(Optional.of(existing));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User updated = userService.updateUserConditions("1", conditions);

        assertEquals(conditions, updated.userConditions());
        verify(userRepository).save(updated);
    }

    @Test
    void updateUserConditions_shouldThrowIfUserNotFound() {
        UserConditions conditions = new UserConditions(
                UserPvConfig.MEDIUM_PV_COMBI, 30, Direction.SOUTH, 0.3
        );
        when(userRepository.findById("999")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> userService.updateUserConditions("999", conditions));
    }

    // ===================================
    // calculateUserResult Tests
    // ===================================
    @Test
    void calculateUserResult_shouldCalculateBasedOnConditions() {
        UserInfo info = new UserInfo(30, 2, 4000);
        UserConditions conditions = new UserConditions(
                UserPvConfig.MEDIUM_PV_COMBI, 30, Direction.SOUTH, 0.0
        );
        User user = new User("1", info, conditions, null);

        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User updated = userService.calculateUserResult("1");

        assertNotNull(updated.userResult());
        assertTrue(updated.userResult().userPossibleElectricityGeneration() > 0);
        assertTrue(updated.userResult().userAmountofPossibleSavings() > 0);
        assertTrue(updated.userResult().userAmortisationTime() > 0);
    }

    @Test
    void calculateUserResult_shouldReturnZeroYieldWhenFullShade() {
        UserInfo info = new UserInfo(30, 2, 4000);
        UserConditions conditions = new UserConditions(
                UserPvConfig.MEDIUM_PV_COMBI, 30, Direction.NORTH, 1.0
        );
        User user = new User("1", info, conditions, null);

        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User updated = userService.calculateUserResult("1");

        assertEquals(0, updated.userResult().userPossibleElectricityGeneration());
        assertEquals(0, updated.userResult().userAmountofPossibleSavings());
        assertEquals(Integer.MAX_VALUE, updated.userResult().userAmortisationTime());
    }

    @Test
    void calculateUserResult_shouldThrowWhenNoConditionsSet() {
        UserInfo info = new UserInfo(30, 2, 4000);
        User user = new User("1", info, null, null);
        when(userRepository.findById("1")).thenReturn(Optional.of(user));

        assertThrows(IllegalStateException.class, () -> userService.calculateUserResult("1"));
    }

    @Test
    void calculateUserResult_shouldThrowWhenNoUserInfoSet() {
        UserConditions conditions = new UserConditions(
                UserPvConfig.MEDIUM_PV_COMBI, 30, Direction.SOUTH, 0.0
        );
        User user = new User("1", null, conditions, null);
        when(userRepository.findById("1")).thenReturn(Optional.of(user));

        assertThrows(IllegalStateException.class, () -> userService.calculateUserResult("1"));
    }

    @Test
    void calculateUserResult_shouldThrowWhenUserNotFound() {
        when(userRepository.findById("999")).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> userService.calculateUserResult("999"));
    }

    @Test
    void calculateUserResult_shouldUseDifferentPvConfigCorrectly() {
        UserInfo info = new UserInfo(30, 2, 4000);

        // Test CHEAP_PV_COMBI (0.8 kWp, 500 EUR)
        UserConditions cheapConditions = new UserConditions(
                UserPvConfig.CHEAP_PV_COMBI, 30, Direction.SOUTH, 0.0
        );
        User cheapUser = new User("1", info, cheapConditions, null);
        when(userRepository.findById("1")).thenReturn(Optional.of(cheapUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User cheapResult = userService.calculateUserResult("1");

        // Test PREMIUM_PV_COMBI (2.0 kWp, 2000 EUR)
        UserConditions premiumConditions = new UserConditions(
                UserPvConfig.PREMIUM_PV_COMBI, 30, Direction.SOUTH, 0.0
        );
        User premiumUser = new User("2", info, premiumConditions, null);
        when(userRepository.findById("2")).thenReturn(Optional.of(premiumUser));

        User premiumResult = userService.calculateUserResult("2");

        // Premium should generate more electricity (2.0 / 0.8 = 2.5x)
        assertTrue(premiumResult.userResult().userPossibleElectricityGeneration() >
                cheapResult.userResult().userPossibleElectricityGeneration());

        // Premium should have higher savings
        assertTrue(premiumResult.userResult().userAmountofPossibleSavings() >
                cheapResult.userResult().userAmountofPossibleSavings());
    }

    @Test
    void calculateUserResult_shouldCalculateWithZeroAngle() {
        UserInfo info = new UserInfo(30, 2, 4000);
        UserConditions conditions = new UserConditions(
                UserPvConfig.MEDIUM_PV_COMBI, 0, Direction.SOUTH, 0.0
        );
        User user = new User("1", info, conditions, null);

        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User updated = userService.calculateUserResult("1");

        // Should still generate electricity, just less efficient
        assertTrue(updated.userResult().userPossibleElectricityGeneration() > 0);
    }

    @Test
    void calculateUserResult_shouldCalculateWithZeroShadeFactor() {
        UserInfo info = new UserInfo(30, 2, 4000);
        UserConditions conditions = new UserConditions(
                UserPvConfig.MEDIUM_PV_COMBI, 30, Direction.SOUTH, 0.0
        );
        User user = new User("1", info, conditions, null);

        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User updated = userService.calculateUserResult("1");

        // Should generate maximum electricity (no shade)
        assertTrue(updated.userResult().userPossibleElectricityGeneration() > 0);
    }
}