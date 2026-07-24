package br.com.smarttask.service.ai;
import br.com.smarttask.strategy.PriorityStrategy;
import org.springframework.stereotype.Service;
import java.time.*;
import java.util.*;
@Service
public class MockAiService implements AiService {
 private final PriorityStrategy priorityStrategy;
 public MockAiService(PriorityStrategy priorityStrategy){this.priorityStrategy=priorityStrategy;}
 public AiTaskSuggestion interpret(String text){
  String clean=text.trim(); String title=clean.length()>70?clean.substring(0,67)+"...":clean;
  String lower=clean.toLowerCase(Locale.ROOT); LocalDate due=null;
  if(lower.contains("hoje")) due=LocalDate.now(); else if(lower.contains("amanhã")||lower.contains("amanha")) due=LocalDate.now().plusDays(1);
  String category = lower.matches(".*(estudar|prova|trabalho|faculdade|poo).*" ) ? "Estudos" : lower.matches(".*(comprar|mercado|pagar).*" ) ? "Pessoal" : "Geral";
  List<String> steps=new ArrayList<>();
  if(lower.contains("dividir")||lower.contains("etapas")){steps=List.of("Planejar a atividade","Executar a parte principal","Revisar e finalizar");}
  return new AiTaskSuggestion(title,clean,priorityStrategy.calculate(clean),due,category,steps);
 }
 public String providerName(){return "MockAI (regras locais)";}
}
