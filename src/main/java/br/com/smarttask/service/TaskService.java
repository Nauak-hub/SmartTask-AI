package br.com.smarttask.service;
import br.com.smarttask.dto.*;
import br.com.smarttask.exception.ResourceNotFoundException;
import br.com.smarttask.mapper.TaskMapper;
import br.com.smarttask.model.*;
import br.com.smarttask.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
@Service
public class TaskService {
 private final TaskRepository repository; private final TaskMapper mapper;
 public TaskService(TaskRepository repository,TaskMapper mapper){this.repository=repository;this.mapper=mapper;}
 @Transactional public TaskResponse create(TaskRequest r){return mapper.toResponse(repository.save(new Task(r.title(),r.description(),r.priority(),r.dueDate(),r.category(),r.subtasks())));}
 @Transactional(readOnly=true) public List<TaskResponse> list(TaskStatus status,String category){
  List<Task> tasks=status!=null?repository.findByStatus(status):category!=null&&!category.isBlank()?repository.findByCategoryIgnoreCase(category):repository.findAll();
  return tasks.stream().map(mapper::toResponse).toList();
 }
 @Transactional(readOnly=true) public TaskResponse find(Long id){return mapper.toResponse(get(id));}
 @Transactional public TaskResponse update(Long id,TaskRequest r){Task t=get(id);t.update(r.title(),r.description(),r.priority(),r.dueDate(),r.category(),r.subtasks());return mapper.toResponse(t);}
 @Transactional public TaskResponse changeStatus(Long id,TaskStatus status){Task t=get(id);t.changeStatus(status);return mapper.toResponse(t);}
 @Transactional public void delete(Long id){repository.delete(get(id));}
 private Task get(Long id){return repository.findById(id).orElseThrow(()->new ResourceNotFoundException("Tarefa "+id+" não encontrada"));}
}
