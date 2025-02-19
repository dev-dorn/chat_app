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
                    // .loginPage("/login") // Uncomment if you have a custom login page
                    .loginProcessingUrl("/perform_login") // Processing URL for form login
                    .defaultSuccessUrl("/", true) // Redirect after successful login
                    .failureUrl("/login?error=true") // Redirect after login failure
                    .permitAll())
                .logout(logout -> logout
                    .logoutUrl("/perform_logout") // URL to trigger logout
                    .logoutSuccessUrl("/login") // Redirect after successful logout
                    .permitAll())
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/signup", "/login", "/perform_login", "/perform_logout", "/ms/**").permitAll() // Allow public access to these endpoints, including WebSocket endpoints
                    .anyRequest().authenticated())
                .csrf(csrf -> csrf.disable()) // Disable CSRF for simplicity (consider enabling in production)
                .userDetailsService(userDetailsService)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
