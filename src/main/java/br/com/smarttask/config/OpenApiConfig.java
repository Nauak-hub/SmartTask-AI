package br.com.smarttask.config;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.*;
@Configuration
public class OpenApiConfig {
 @Bean OpenAPI smartTaskOpenAPI(){return new OpenAPI().info(new Info().title("SmartTask AI API").version("1.0.0").description("API acadêmica de gerenciamento inteligente de tarefas"));}
}
