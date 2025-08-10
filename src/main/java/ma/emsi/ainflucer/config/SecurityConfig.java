package ma.emsi.ainflucer.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // remplace csrf().disable()
                .authorizeHttpRequests(authorize -> authorize
                        .anyRequest().permitAll() // remplace authorizeRequests().anyRequest().permitAll()
                );

        return http.build();
    }
}
