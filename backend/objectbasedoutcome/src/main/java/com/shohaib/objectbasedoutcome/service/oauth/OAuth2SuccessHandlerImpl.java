package com.shohaib.objectbasedoutcome.service.oauth;

import com.shohaib.objectbasedoutcome.domain.model.User;
import com.shohaib.objectbasedoutcome.domain.repository.UserRepository;
import com.shohaib.objectbasedoutcome.service.user.UserDetailsServiceImplementation;
import com.shohaib.objectbasedoutcome.util.JWTUtils;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OAuth2SuccessHandlerImpl extends SimpleUrlAuthenticationSuccessHandler implements OAuth2SuccessHandler {
    private final JWTUtils jwtUtils;
    private final UserRepository userRepository;
    private final UserDetailsServiceImplementation userDetailsService;
    private static final String FRONTEND_URL = "http://localhost:4200";


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        if (email == null) {
            String login = oAuth2User.getAttribute("login");
            email = login + "@github.com";
        }
        log.info("OAuth2SuccessHandler → email: {}", email);
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
            String token = jwtUtils.generateToken(userDetails);

            log.info("JWT generated for: {}", user.getUsername());
            String redirectUrl = FRONTEND_URL + "/oauth2/callback?token=" + token;
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);

        } else {
            log.error("User not found after OAuth2 login: {}", email);
            getRedirectStrategy().sendRedirect(
                    request, response,
                    FRONTEND_URL + "/login?error=oauth_failed"
            );
        }
    }


}
