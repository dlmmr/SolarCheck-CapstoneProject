package org.example.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleIllegalState(IllegalStateException ex) {
        // Vollständigen Stacktrace loggen
        logger.error("IllegalStateException while handling request", ex);
        // Nur generische Nachricht an Client
        return ResponseEntity.badRequest().body("Request cannot be processed");
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
        logger.error("IllegalArgumentException while handling request", ex);
        return ResponseEntity.badRequest().body("Invalid request");
    }

    // Optional: weitere Exceptions global abfangen
}
