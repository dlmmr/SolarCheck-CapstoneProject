package org.example.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /** Gemeinsamer Schlüsselname für Fehlermeldungen */
    private static final String ERROR_KEY = "error";

    /**
     * Behandelt Validierungsfehler von @Valid Annotationen.
     * Loggt als DEBUG, da diese Fehler durch Benutzereingaben verursacht werden
     * und keine technischen Fehler darstellen.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        if (logger.isDebugEnabled()) {
            logger.debug("Validation failed: {}", ex.getMessage());
        }

        Map<String, Object> response = new HashMap<>();
        response.put(ERROR_KEY, "Validation failed");

        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            fieldErrors.put(fieldName, errorMessage);
        });

        response.put("fieldErrors", fieldErrors);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    /**
     * Behandelt Business-Logik Fehler (z.B. fehlende UserInfo oder UserConditions).
     * Loggt als WARN, da es sich um erwartbare Zustände handelt.
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleIllegalState(IllegalStateException ex) {
        logger.warn("Business logic error: {}", ex.getMessage());

        Map<String, String> response = new HashMap<>();
        response.put(ERROR_KEY, ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    /**
     * Behandelt ungültige Argumente (z.B. User nicht gefunden).
     * Loggt als WARN, da es sich um erwartbare Fehler handelt.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        logger.warn("Invalid argument: {}", ex.getMessage());

        Map<String, String> response = new HashMap<>();
        response.put(ERROR_KEY, ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    /**
     * Fallback für alle unerwarteten Exceptions.
     * Loggt als ERROR, da es sich um technische Fehler handelt.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        logger.error("Unexpected error occurred", ex);

        Map<String, String> response = new HashMap<>();
        response.put(ERROR_KEY, "Ein unerwarteter Fehler ist aufgetreten");

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }
}
