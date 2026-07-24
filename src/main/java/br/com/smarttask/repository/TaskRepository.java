package br.com.smarttask.repository;
import br.com.smarttask.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface TaskRepository extends JpaRepository<Task,Long>{
 List<Task> findByStatus(TaskStatus status);
 List<Task> findByCategoryIgnoreCase(String category);
}
