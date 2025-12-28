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
    private final DataSource dataSource;

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
            JWTAuthenticationFilter authenticationFilter,
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




//    @Autowired
//    private UserDetailsServiceImplementation userDetailsService;
//    @Autowired
//    private JWTUtils jwtUtils;
//
//    @Bean
//    public PasswordEncoder getPasswordEncoder() {
//        Map<String, PasswordEncoder> encoders = new HashMap<>();
//        encoders.put("bcrypt", new BCryptPasswordEncoder());
//        DelegatingPasswordEncoder passwordEncoder =
//                new DelegatingPasswordEncoder("bcrypt", encoders);
//        passwordEncoder.setDefaultPasswordEncoderForMatches(encoders.get("bcrypt"));
//        return passwordEncoder;
//    }
//    @Autowired
//    public void configureAuthentication(AuthenticationManagerBuilder authenticationManagerBuilder)
//            throws Exception {
//        authenticationManagerBuilder.userDetailsService(this.userDetailsService)
//                .passwordEncoder(this.getPasswordEncoder()).and().jdbcAuthentication();
//    }
//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception{
//        return configuration.getAuthenticationManager();
//    }
//
//    @Bean
//    public JWTAuthenticationFilter jwtAuthenticationFilterBean() throws Exception{
//        JWTAuthenticationFilter authenticationTokenFilter = new JWTAuthenticationFilter(jwtUtils,userDetailsService);
//        authenticationTokenFilter.setAuthenticationManager(this.authenticationManager());
//        return authenticationTokenFilter;
//    }
//
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        CorsConfiguration config = new CorsConfiguration();
//        config.setAllowCredentials(true);
//        config.addAllowedOrigin("*");
//        config.addAllowedHeader("Authorization");
//        config.addAllowedHeader("*");
//        config.addAllowedMethod("*");
//        source.registerCorsConfiguration("//**", config);
//        source.registerCorsConfiguration("/**", config);
//        return source;
//    }

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
