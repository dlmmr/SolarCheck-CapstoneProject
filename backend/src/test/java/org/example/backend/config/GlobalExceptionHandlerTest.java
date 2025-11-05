package org.example.backend.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

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

        MethodArgumentNotValidException ex =
                new MethodArgumentNotValidException(null, bindingResult);

        // Act
        ResponseEntity<Map<String, Object>> response = handler.handleValidationExceptions(ex);

        // Assert
        assertEquals(400, response.getStatusCodeValue());
        assertTrue(response.getBody().containsKey("error"));
        assertTrue(((Map<?, ?>) response.getBody().get("fieldErrors")).containsKey("username"));
        assertEquals("must not be blank",
                ((Map<?, ?>) response.getBody().get("fieldErrors")).get("username"));
    }

    @Test
    void handleIllegalState_ShouldReturnBadRequest() {
        IllegalStateException ex = new IllegalStateException("Business rule violated");

        ResponseEntity<Map<String, String>> response = handler.handleIllegalState(ex);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Business rule violated", response.getBody().get("error"));
    }

    @Test
    void handleIllegalArgument_ShouldReturnBadRequest() {
        IllegalArgumentException ex = new IllegalArgumentException("Invalid user ID");

        ResponseEntity<Map<String, String>> response = handler.handleIllegalArgument(ex);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Invalid user ID", response.getBody().get("error"));
    }

    @Test
    void handleGenericException_ShouldReturnInternalServerError() {
        Exception ex = new Exception("Something went wrong");

        ResponseEntity<Map<String, String>> response = handler.handleGenericException(ex);

        assertEquals(500, response.getStatusCodeValue());
        assertEquals("Ein unerwarteter Fehler ist aufgetreten", response.getBody().get("error"));
    }
}
