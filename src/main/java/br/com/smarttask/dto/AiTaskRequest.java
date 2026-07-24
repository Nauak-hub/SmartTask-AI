package br.com.smarttask.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
public record AiTaskRequest(@NotBlank @Size(max=1000) String text) {}
