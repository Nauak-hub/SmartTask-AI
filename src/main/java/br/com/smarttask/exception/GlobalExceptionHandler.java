package br.com.smarttask.exception;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;
@RestControllerAdvice
public class GlobalExceptionHandler {
 @ExceptionHandler(ResourceNotFoundException.class)
 ResponseEntity<ApiError> notFound(ResourceNotFoundException ex){return ResponseEntity.status(404).body(new ApiError(LocalDateTime.now(),404,"Not Found",ex.getMessage(),Map.of()));}
 @ExceptionHandler(MethodArgumentNotValidException.class)
 ResponseEntity<ApiError> validation(MethodArgumentNotValidException ex){
  Map<String,String> errors=new LinkedHashMap<>(); ex.getBindingResult().getFieldErrors().forEach(e->errors.put(e.getField(),e.getDefaultMessage()));
  return ResponseEntity.badRequest().body(new ApiError(LocalDateTime.now(),400,"Validation Error","Dados inválidos",errors));
 }
}
