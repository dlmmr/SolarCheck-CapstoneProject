package org.example.backend.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;


import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler handler;

    @BeforeEach
    void setUp() {
        handler = new GlobalExceptionHandler();
    }

    @Test
    void handleValidationExceptions_ShouldReturnBadRequestWithFieldErrors() {
        // Arrange
        BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(new Object(), "objectName");
        bindingResult.addError(new FieldError("objectName", "username", "must not be blank"));

        // ✅ Mock-Parameter statt null (oder verwende einen Mock)
        MethodArgumentNotValidException ex =
                new MethodArgumentNotValidException(
                        new org.springframework.core.MethodParameter(
                                this.getClass().getDeclaredMethods()[0], -1
                        ),
                        bindingResult
                );

        // Act
        ResponseEntity<Map<String, Object>> response = handler.handleValidationExceptions(ex);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        // ✅ Null-Check für getBody()
        assertNotNull(response.getBody(), "Response body should not be null");
        assertTrue(response.getBody().containsKey("error"));
        assertTrue(response.getBody().containsKey("fieldErrors"));

        Map<?, ?> fieldErrors = (Map<?, ?>) response.getBody().get("fieldErrors");
        assertNotNull(fieldErrors, "Field errors should not be null");
        assertTrue(fieldErrors.containsKey("username"));
        assertEquals("must not be blank", fieldErrors.get("username"));
    }

    @Test
    void handleIllegalState_ShouldReturnBadRequest() {
        // Arrange
        IllegalStateException ex = new IllegalStateException("Business rule violated");

        // Act
        ResponseEntity<Map<String, String>> response = handler.handleIllegalState(ex);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        // ✅ Null-Check
        assertNotNull(response.getBody(), "Response body should not be null");
        assertEquals("Business rule violated", response.getBody().get("error"));
    }

    @Test
    void handleIllegalArgument_ShouldReturnBadRequest() {
        // Arrange
        IllegalArgumentException ex = new IllegalArgumentException("Invalid user ID");

        // Act
        ResponseEntity<Map<String, String>> response = handler.handleIllegalArgument(ex);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        // ✅ Null-Check
        assertNotNull(response.getBody(), "Response body should not be null");
        assertEquals("Invalid user ID", response.getBody().get("error"));
    }

    @Test
    void handleGenericException_ShouldReturnInternalServerError() {
        // Arrange
        Exception ex = new Exception("Something went wrong");

        // Act
        ResponseEntity<Map<String, String>> response = handler.handleGenericException(ex);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());

        // ✅ Null-Check
        assertNotNull(response.getBody(), "Response body should not be null");
        assertEquals("Ein unerwarteter Fehler ist aufgetreten", response.getBody().get("error"));
    }
}