package com.shohaib.objectbasedoutcome.service.oauth;


import com.shohaib.objectbasedoutcome.domain.model.User;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;

public interface CustomOAuth2UserService  {
    OAuth2User loadUser(OAuth2UserRequest user) throws OAuth2AuthenticationException;

}
