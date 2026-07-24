package br.com.smarttask.service;
import br.com.smarttask.dto.AiSuggestionResponse;
import br.com.smarttask.service.ai.*;
import org.springframework.stereotype.Service;
@Service
public class AiApplicationService {
 private final AiService aiService;
 public AiApplicationService(AiService aiService){this.aiService=aiService;}
 public AiSuggestionResponse suggest(String text){AiTaskSuggestion s=aiService.interpret(text);return new AiSuggestionResponse(s.title(),s.description(),s.priority(),s.dueDate(),s.category(),s.subtasks(),aiService.providerName());}
}
