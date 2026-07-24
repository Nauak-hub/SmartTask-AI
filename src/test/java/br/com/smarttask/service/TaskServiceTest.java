package br.com.smarttask.service;
import br.com.smarttask.mapper.TaskMapper;
import br.com.smarttask.model.*;
import br.com.smarttask.repository.TaskRepository;
import org.junit.jupiter.api.*;
import org.mockito.*;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
class TaskServiceTest {
 @Mock TaskRepository repository; TaskService service;
 @BeforeEach void setup(){MockitoAnnotations.openMocks(this);service=new TaskService(repository,new TaskMapper());}
 @Test void shouldRejectMissingTask(){when(repository.findById(99L)).thenReturn(Optional.empty());assertThrows(RuntimeException.class,()->service.find(99L));}
 @Test void shouldDeleteExistingTask(){Task t=new Task("Teste","Descrição",Priority.MEDIUM,null,"Geral",List.of());when(repository.findById(1L)).thenReturn(Optional.of(t));service.delete(1L);verify(repository).delete(t);}
}
