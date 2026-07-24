package br.com.smarttask.mapper;
import br.com.smarttask.dto.*;
import br.com.smarttask.model.Task;
import org.springframework.stereotype.Component;
@Component
public class TaskMapper {
 public TaskResponse toResponse(Task t){return new TaskResponse(t.getId(),t.getTitle(),t.getDescription(),t.getPriority(),t.getStatus(),t.getDueDate(),t.getCategory(),t.getSubtasks(),t.getCreatedAt(),t.getUpdatedAt());}
}
