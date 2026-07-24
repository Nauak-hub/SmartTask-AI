package br.com.smarttask.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tasks")
public class Task {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 120)
    private String title;
    @Column(length = 1000)
    private String description;
    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private Priority priority;
    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private TaskStatus status;
    private LocalDate dueDate;
    @Column(nullable = false)
    private String category;
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name="task_subtasks", joinColumns=@JoinColumn(name="task_id"))
    @Column(name="subtask")
    private List<String> subtasks = new ArrayList<>();
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    protected Task() {}

    public Task(String title, String description, Priority priority, LocalDate dueDate, String category, List<String> subtasks) {
        this.title = title;
        this.description = description;
        this.priority = priority == null ? Priority.MEDIUM : priority;
        this.status = TaskStatus.PENDING;
        this.dueDate = dueDate;
        this.category = category == null || category.isBlank() ? "Geral" : category;
        this.subtasks = subtasks == null ? new ArrayList<>() : new ArrayList<>(subtasks);
    }

    @PrePersist void prePersist(){ createdAt=LocalDateTime.now(); updatedAt=createdAt; }
    @PreUpdate void preUpdate(){ updatedAt=LocalDateTime.now(); }

    public void update(String title, String description, Priority priority, LocalDate dueDate, String category, List<String> subtasks){
        this.title=title; this.description=description; this.priority=priority; this.dueDate=dueDate; this.category=category;
        this.subtasks = subtasks == null ? new ArrayList<>() : new ArrayList<>(subtasks);
    }
    public void changeStatus(TaskStatus status){ this.status=status; }
    public Long getId(){return id;} public String getTitle(){return title;} public String getDescription(){return description;}
    public Priority getPriority(){return priority;} public TaskStatus getStatus(){return status;} public LocalDate getDueDate(){return dueDate;}
    public String getCategory(){return category;} public List<String> getSubtasks(){return List.copyOf(subtasks);}
    public LocalDateTime getCreatedAt(){return createdAt;} public LocalDateTime getUpdatedAt(){return updatedAt;}
}
