package br.com.smarttask.controller;

import br.com.smarttask.dto.TaskRequest;
import br.com.smarttask.dto.TaskResponse;
import br.com.smarttask.model.Priority;
import br.com.smarttask.model.TaskStatus;
import br.com.smarttask.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TaskController.class)
class TaskControllerIntegrationTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private TaskService taskService;

    @Test
    void shouldCreateTask() throws Exception {
        String requestBody = """
                {
                  "title": "Estudar POO",
                  "description": "Revisar orientação a objetos",
                  "priority": "HIGH",
                  "dueDate": "2026-08-01",
                  "category": "Estudos",
                  "subtasks": ["Revisar encapsulamento", "Revisar polimorfismo"]
                }
                """;

        LocalDateTime now = LocalDateTime.of(2026, 7, 24, 10, 0);

        TaskResponse response = new TaskResponse(
                1L,
                "Estudar POO",
                "Revisar orientação a objetos",
                Priority.HIGH,
                TaskStatus.PENDING,
                LocalDate.of(2026, 8, 1),
                "Estudos",
                List.of("Revisar encapsulamento", "Revisar polimorfismo"),
                now,
                now
        );

        when(taskService.create(any(TaskRequest.class))).thenReturn(response);

        mvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Estudar POO"))
                .andExpect(jsonPath("$.priority").value("HIGH"))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void shouldValidateTitle() throws Exception {
        String requestBody = """
                {
                  "title": "",
                  "description": "Descrição de teste",
                  "priority": "MEDIUM",
                  "dueDate": "2026-08-01",
                  "category": "Estudos",
                  "subtasks": []
                }
                """;

        mvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }
}
