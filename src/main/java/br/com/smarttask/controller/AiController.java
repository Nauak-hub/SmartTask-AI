package br.com.smarttask.controller;
import br.com.smarttask.dto.*;
import br.com.smarttask.service.AiApplicationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/ai")
public class AiController {
 private final AiApplicationService service; public AiController(AiApplicationService service){this.service=service;}
 @PostMapping("/suggest-task") public AiSuggestionResponse suggest(@Valid @RequestBody AiTaskRequest r){return service.suggest(r.text());}
}
