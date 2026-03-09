package com.shohaib.objectbasedoutcome.configuration.security;

import com.shohaib.objectbasedoutcome.filter.JWTAuthenticationFilter;
import com.shohaib.objectbasedoutcome.service.user.UserDetailsServiceImplementation;
import com.shohaib.objectbasedoutcome.util.JWTUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration  {
    private final UserDetailsServiceImplementation userDetailsService;
    private final JWTUtils jwtUtils;
    @Bean
    public PasswordEncoder passwordEncoder(){
        Map<String, PasswordEncoder> encoderMap = new HashMap<>();
        encoderMap.put("bcrypt",new BCryptPasswordEncoder());
        DelegatingPasswordEncoder encoder = new DelegatingPasswordEncoder("bcrypt", encoderMap);
        encoder.setDefaultPasswordEncoderForMatches(encoderMap.get("bcrypt"));
        return encoder;
    }
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception{
        AuthenticationManagerBuilder auth = http.getSharedObject(AuthenticationManagerBuilder.class);
        auth.userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());
        return auth.build();
    }
    @Bean
    public JWTAuthenticationFilter jwtAuthenticationFilter(AuthenticationManager authenticationManager){
        JWTAuthenticationFilter authenticationFilter = new JWTAuthenticationFilter(jwtUtils,userDetailsService);
        authenticationFilter.setAuthenticationManager(authenticationManager);
        return authenticationFilter;
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.addAllowedOriginPattern("*");
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.addAllowedMethod("*");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**",corsConfiguration);
        return source;
    }
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity httpSecurity,
            JWTAuthenticationFilter jwtAuthenticationFilter) throws Exception{
        httpSecurity
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .logout(logout -> logout.disable())
                .authorizeHttpRequests(auth  -> auth
                        .requestMatchers("logout").authenticated()
                        .anyRequest().permitAll()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return httpSecurity.build();
    }
}
