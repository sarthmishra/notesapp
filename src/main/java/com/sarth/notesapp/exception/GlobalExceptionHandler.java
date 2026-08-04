package com.sarth.notesapp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice//@RestControllerAdvice error responses deta hai jab exceptions aayen, kahin se bhi aayen.
public class GlobalExceptionHandler {

    @ExceptionHandler(NoteNotFoundException.class)
//Ye method-level annotation batata hai: "Jab bhi kahin NoteNotFoundException throw ho, is method ko chalao use handle karne ke liye."


    /*ResponseEntity<...> — Ye Spring ki ek special class hai jo humein poora control deti hai
     response pe — sirf data nahi, balki HTTP status code bhi khud set kar sakte hain
     (jo pehle automatic tha, 200 OK by default).*/
    public ResponseEntity<Map<String, String>> handleNoteNotFound(NoteNotFoundException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);


    }
}
/*
* Method signature bolta hai:
"Main ResponseEntity dunga, jiske andar Map<String, String> hoga"
                    ↓
Andar hum exactly wahi banate hain:
Map<String, String> errorResponse = new HashMap<>();
errorResponse.put("error", ex.getMessage());
                    ↓
Aur usi ko wrap karke return karte hain:
return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
                    ↓
Java check karta hai: "Kya jo return ho raha hai, wo signature se match karta hai?"
Haan — ResponseEntity<Map<String, String>> ✓*/
