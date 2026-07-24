package br.com.smarttask.controller;
import br.com.smarttask.dto.*;
import br.com.smarttask.model.TaskStatus;
import br.com.smarttask.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/tasks")
public class TaskController {
 private final TaskService service; public TaskController(TaskService service){this.service=service;}
 @PostMapping public ResponseEntity<TaskResponse> create(@Valid @RequestBody TaskRequest r){return ResponseEntity.status(201).body(service.create(r));}
 @GetMapping public List<TaskResponse> list(@RequestParam(required=false) TaskStatus status,@RequestParam(required=false) String category){return service.list(status,category);}
 @GetMapping("/{id}") public TaskResponse find(@PathVariable Long id){return service.find(id);}
 @PutMapping("/{id}") public TaskResponse update(@PathVariable Long id,@Valid @RequestBody TaskRequest r){return service.update(id,r);}
 @PatchMapping("/{id}/status") public TaskResponse status(@PathVariable Long id,@RequestParam TaskStatus status){return service.changeStatus(id,status);}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id){service.delete(id);}
}
