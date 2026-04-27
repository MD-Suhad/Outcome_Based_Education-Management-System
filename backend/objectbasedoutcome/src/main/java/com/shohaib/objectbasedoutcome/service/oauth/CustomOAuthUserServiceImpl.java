package com.shohaib.objectbasedoutcome.service.oauth;

import com.shohaib.objectbasedoutcome.domain.model.User;
import com.shohaib.objectbasedoutcome.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuthUserServiceImpl extends DefaultOAuth2UserService implements CustomOAuth2UserService {

    private final UserRepository userRepository;
    @Override
    public OAuth2User  loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String provider = userRequest.getClientRegistration().getRegistrationId();
        String email = null;
        String firstName = null;
        String lastName = null;
        String picture = null;
        String providerId = null;
        if (provider.equals("google")) {
            email = oAuth2User.getAttribute("email");
            String fullName = oAuth2User.getAttribute("name");
            picture = oAuth2User.getAttribute("picture");
            providerId = oAuth2User.getAttribute("sub");
            String[] fullListName = fullName != null ? fullName.split(" ", 2) : new String[]{"User", ""};
            firstName = fullListName[0];
            lastName = fullListName.length > 1 ? fullListName[1] : "";
        } else {
            String login = oAuth2User.getAttribute("login");
            picture = oAuth2User.getAttribute("avatar_url");
            providerId = String.valueOf(oAuth2User.getAttribute("id"));
            email = oAuth2User.getAttribute("email");
            firstName = login != null ? login : "GitHub";
            lastName = "User";
            if (email == null) {
                email = login + "@github.com";
            }
        }
        Optional<User> existingUser = this.userRepository.findByEmail(email);
        User user = existingUser.orElse(new User());
        user.setEmail(email);
        user.setProvider(provider);
        user.setProviderId(providerId);
        user.setProfileImage(picture);
        user.setEmailVerified(true);
        if (existingUser.isEmpty()) {
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setUsername(email.split("@")[0] + "_" + provider);  // e.g. shohaib_google
            user.setPassword("");
            user.setPhoneNumber("N/A");
            user.setAddress("N/A");
            log.info("New OAuth2 user registered: {} via {}", email, provider);
        } else {
            log.info("Existing OAuth2 user logged in: {} via {}", email, provider);
        }
        this.userRepository.save(user);
        return oAuth2User;
    }

}
