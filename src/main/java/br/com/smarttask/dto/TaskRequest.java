package br.com.smarttask.dto;

import br.com.smarttask.model.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

public record TaskRequest(
 @NotBlank @Size(max=120) String title,
 @Size(max=1000) String description,
 Priority priority,
 LocalDate dueDate,
 @Size(max=60) String category,
 List<@NotBlank String> subtasks) {}
