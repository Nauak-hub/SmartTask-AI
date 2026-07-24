package br.com.smarttask.dto;
import br.com.smarttask.model.Priority;
import java.time.LocalDate;
import java.util.List;
public record AiSuggestionResponse(String title,String description,Priority priority,LocalDate dueDate,String category,List<String> subtasks,String provider) {}
