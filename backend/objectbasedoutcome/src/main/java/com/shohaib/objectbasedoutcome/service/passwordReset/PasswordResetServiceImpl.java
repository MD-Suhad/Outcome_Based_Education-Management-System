package com.shohaib.objectbasedoutcome.service.passwordReset;

import com.shohaib.objectbasedoutcome.configuration.security.SecurityConstants;
import com.shohaib.objectbasedoutcome.domain.model.PasswordResets;
import com.shohaib.objectbasedoutcome.domain.model.User;
import com.shohaib.objectbasedoutcome.domain.repository.PasswordResetRepository;
import com.shohaib.objectbasedoutcome.domain.repository.UserRepository;
import com.shohaib.objectbasedoutcome.dto.model.PasswordResetDTO;
import com.shohaib.objectbasedoutcome.service.exception.handler.EmailNotFoundException;
import com.shohaib.objectbasedoutcome.service.exception.handler.UserNotFoundException;
import com.shohaib.objectbasedoutcome.util.RandomTokenGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.sql.Date;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Optional;

@Service
public class PasswordResetServiceImpl implements PasswordResetService{
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordResetRepository passwordResetsRepository;

    @Override
    public String sendResetEmail(PasswordResetDTO passwordResetDTO) throws EmailNotFoundException, UserNotFoundException {
        Optional<User> user;
        user = userRepository.findByEmail(passwordResetDTO.getEmail());
        String token = RandomTokenGenerator.generate(128);
        String tokenLink = "localhost:8080/reset-password/" +token;
        LocalDate days = LocalDate.now().plusDays(SecurityConstants.RESET_PASSWORD_EXP_TIME);
        java.util.Date date = Date.from(days.atStartOfDay(ZoneId.of("Asia/Dhaka")).toInstant());
        PasswordResets passwordResets = new PasswordResets()
                .setEmail(passwordResetDTO.getEmail()).setToken(token).setExpiryDate(date);
        passwordResetsRepository.save(passwordResets);
        return "Check Your Mail Confirmation Link";
    }
}
