package com.shohaib.objectbasedoutcome.service.passwordReset;

import com.shohaib.objectbasedoutcome.configuration.security.SecurityConstants;
import com.shohaib.objectbasedoutcome.domain.model.PasswordResets;
import com.shohaib.objectbasedoutcome.domain.model.User;
import com.shohaib.objectbasedoutcome.domain.repository.PasswordResetRepository;
import com.shohaib.objectbasedoutcome.domain.repository.UserRepository;
import com.shohaib.objectbasedoutcome.dto.model.PasswordResetDTO;
import com.shohaib.objectbasedoutcome.dto.model.UserDTO;
import com.shohaib.objectbasedoutcome.service.emailService.EmailService;
import com.shohaib.objectbasedoutcome.service.exception.handler.EmailNotFoundException;
import com.shohaib.objectbasedoutcome.service.exception.handler.PasswordDontMatchException;
import com.shohaib.objectbasedoutcome.service.exception.handler.UserNotFoundException;
import com.shohaib.objectbasedoutcome.service.user.UserService;
import com.shohaib.objectbasedoutcome.util.RandomTokenGenerator;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    @Autowired
    private EmailService emailService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserService userService;

    @Override
    public String sendResetEmail(PasswordResetDTO passwordResetDTO) throws EmailNotFoundException, MessagingException {
        Optional<User> user;
        user = userRepository.findByEmail(passwordResetDTO.getEmail());
        String token = RandomTokenGenerator.generate(128);
        String tokenLink = "localhost:8080/reset-password/" +token;
        LocalDate days = LocalDate.now().plusDays(SecurityConstants.RESET_PASSWORD_EXP_TIME);
        java.util.Date date = Date.from(days.atStartOfDay(ZoneId.of("Asia/Dhaka")).toInstant());
        PasswordResets passwordResets = new PasswordResets()
                .setEmail(passwordResetDTO.getEmail()).setToken(token).setExpiryDate(date);
        this.emailService.sendMailToResetPassword(passwordResetDTO.getEmail(), user.get().getFirstName() != null ? user.get().getFirstName() : "", user.get().getLastName() != null ? user.get().getLastName() : "", tokenLink, "Password Reset Request");
        passwordResetsRepository.save(passwordResets);
        return "Check Your Mail Confirmation Link";
    }

    @Override
    public String verityEmailToken(PasswordResetDTO passwordResetDTO) throws PasswordDontMatchException {
            if(!passwordResetDTO.getNewPassword().equals(passwordResetDTO.getConfirmPassword())){
                throw new PasswordDontMatchException("Password do not match");
            }
            //hash password
            passwordResetDTO.setNewPassword(passwordEncoder.encode(passwordResetDTO.getNewPassword()));
            Optional<PasswordResets> passwordResets = this.passwordResetsRepository.findByToken(passwordResetDTO.getToken());
            if(passwordResets.isEmpty()){
                throw new PasswordDontMatchException("Token In Invalid");
            }
            final java.util.Date expiration = passwordResets.get().getExpiryDate();
            if(expiration.before(new java.util.Date(System.currentTimeMillis()))){
                throw new PasswordDontMatchException("Token Is Expired");
            } else{
                if(changeUserPassword(passwordResets.get(), passwordResetDTO.getNewPassword())){
                    passwordResetsRepository.deleteById(passwordResets.get().getId());
                    return "Password Changed Successfully";
                } else {
                    return String.format("User with given email: '%s' does not exist",passwordResets.get().getEmail());
                }
            }
    }

    @Override
    public boolean changeUserPassword(PasswordResets passwordResets, String newPassword) throws PasswordDontMatchException {

        Optional<User> user;
        try{
            user = this.userRepository.findByEmail(passwordResets.getEmail());
            userService.updatePassword(new UserDTO().setPassword(newPassword).setUsername(user.get().getUsername()));
            return true;
        } catch (UserNotFoundException  e)
        {
            return false;
        }
        }
    @Override
    public String manualResetPassword(PasswordResetDTO passwordResetDTO) throws UserNotFoundException {
        User user = this.userRepository.findByEmail(passwordResetDTO.getEmail()).orElseThrow(()->new UserNotFoundException(String.format("User with %s could not found", passwordResetDTO.getEmail())));
        user.setPassword(passwordEncoder.encode("12345678"));
        this.userRepository.save(user);
        return "Password has been restored";
    }

}
