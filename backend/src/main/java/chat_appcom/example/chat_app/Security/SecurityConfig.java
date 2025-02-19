package chat_appcom.example.chat_app.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserDetailsService userDetailsService;

    public SecurityConfig(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .formLogin(form -> form
                   // .loginPage("/login") // Specifies the login page endpoint
                    .loginProcessingUrl("/perform_login") // Specifies the processing URL for form login
                    .defaultSuccessUrl("/", true) // URL to redirect to after successful login
                    .failureUrl("/login?error=true") // URL to redirect to after login failure
                    .permitAll()) // Allows everyone to see the login page
                .logout(logout -> logout
                    .logoutUrl("/perform_logout") // URL to trigger logout
                    .logoutSuccessUrl("/login") // URL to redirect to after successful logout
                    .permitAll()) // Allows everyone to trigger logout
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/signup", "/login", "/perform_login", "/perform_logout").permitAll() // Allows access to these endpoints without authentication
                    .anyRequest().authenticated()) // Requires authentication for any other request
                .csrf(csrf -> csrf.disable()) // Disable CSRF for simplicity
                .userDetailsService(userDetailsService) // Use custom UserDetailsService
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
