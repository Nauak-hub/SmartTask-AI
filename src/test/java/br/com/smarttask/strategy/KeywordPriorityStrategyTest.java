package br.com.smarttask.strategy;
import br.com.smarttask.model.Priority;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
class KeywordPriorityStrategyTest {
 private final KeywordPriorityStrategy strategy=new KeywordPriorityStrategy();
 @Test void shouldDetectUrgent(){assertEquals(Priority.URGENT,strategy.calculate("Entregar hoje com urgência"));}
 @Test void shouldDefaultToMedium(){assertEquals(Priority.MEDIUM,strategy.calculate("Organizar meus arquivos"));}
}
