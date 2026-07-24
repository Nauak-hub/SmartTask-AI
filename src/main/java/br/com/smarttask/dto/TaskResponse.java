package br.com.smarttask.dto;
import br.com.smarttask.model.*;
import java.time.*;
import java.util.List;
public record TaskResponse(Long id,String title,String description,Priority priority,TaskStatus status,LocalDate dueDate,String category,List<String> subtasks,LocalDateTime createdAt,LocalDateTime updatedAt) {}
