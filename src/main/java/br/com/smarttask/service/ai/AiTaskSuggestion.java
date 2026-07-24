package br.com.smarttask.service.ai;
import br.com.smarttask.model.Priority;
import java.time.LocalDate;
import java.util.List;
public record AiTaskSuggestion(String title,String description,Priority priority,LocalDate dueDate,String category,List<String> subtasks) {}
