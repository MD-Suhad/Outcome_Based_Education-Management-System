package com.shohaib.objectbasedoutcome.configuration.security;

import com.shohaib.objectbasedoutcome.filter.JWTAuthenticationFilter;
import com.shohaib.objectbasedoutcome.service.user.UserDetailsServiceImplementation;
import com.shohaib.objectbasedoutcome.util.JWTUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class SecurityConfiguration extends WebSecurityConfiguration {

    @Autowired
    private UserDetailsServiceImplementation userDetailsService;
    @Autowired
    private JWTUtils jwtUtils;

    @Bean
    public PasswordEncoder getPasswordEncoder() {
        Map<String, PasswordEncoder> encoders = new HashMap<>();
        encoders.put("bcrypt", new BCryptPasswordEncoder());
        DelegatingPasswordEncoder passwordEncoder =
                new DelegatingPasswordEncoder("bcrypt", encoders);
        passwordEncoder.setDefaultPasswordEncoderForMatches(encoders.get("bcrypt"));
        return passwordEncoder;
    }
    @Autowired
    public void configureAuthentication(AuthenticationManagerBuilder authenticationManagerBuilder)
            throws Exception {
        authenticationManagerBuilder.userDetailsService(this.userDetailsService)
                .passwordEncoder(this.getPasswordEncoder()).and().jdbcAuthentication();
    }
    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws {
        return super.authenticationManagerBean();
    }

    @Bean
    public JWTAuthenticationFilter jwtAuthenticationFilterBean() throws Exception{
        JWTAuthenticationFilter authenticationTokenFilter = new JWTAuthenticationFilter(jwtUtils,userDetailsService);
        authenticationTokenFilter.setAuthenticationManager(this.authenticationManagerBean());
        return authenticationTokenFilter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("*");
        config.addAllowedHeader("Authorization");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("//**", config);
        source.registerCorsConfiguration("/**", config);
        return source;
    }

//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//
//        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
//                .csrf(csrf -> csrf.disable())
//                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .logout(logout -> logout
//                        .logoutRequestMatcher(new AntPathRequestMatcher(SecurityConstants.LOGOUT_URL))
//                        .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler(HttpStatus.OK))
//                )
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/api/v1/auth/registrar", "/public/**").permitAll()
//                        .anyRequest().authenticated()
//                )
//                .addFilterBefore((Filter) jwtFilter, UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//        http.csrf(httpSecurityCsrfConfigurer -> httpSecurityCsrfConfigurer.disable())
//                .cors(corsConfigurationSource() -> corsConfigurationSource().)
//    }
}
