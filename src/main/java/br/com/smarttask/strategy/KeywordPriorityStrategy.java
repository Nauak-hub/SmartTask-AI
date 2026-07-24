package br.com.smarttask.strategy;
import br.com.smarttask.model.Priority;
import org.springframework.stereotype.Component;
import java.util.Locale;
@Component
public class KeywordPriorityStrategy implements PriorityStrategy {
 public Priority calculate(String text){
  String t=text.toLowerCase(Locale.ROOT);
  if(t.contains("urgente")||t.contains("imediatamente")||t.contains("hoje")) return Priority.URGENT;
  if(t.contains("alta prioridade")||t.contains("importante")) return Priority.HIGH;
  if(t.contains("baixa prioridade")||t.contains("quando puder")) return Priority.LOW;
  return Priority.MEDIUM;
 }
}
