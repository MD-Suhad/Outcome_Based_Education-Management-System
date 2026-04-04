package com.shohaib.objectbasedoutcome.service.passwordReset;

import com.shohaib.objectbasedoutcome.dto.model.PasswordResetDTO;
import com.shohaib.objectbasedoutcome.service.exception.handler.EmailNotFoundException;
import com.shohaib.objectbasedoutcome.service.exception.handler.UserNotFoundException;

public interface PasswordResetService {
    String sendResetEmail(PasswordResetDTO passwordResetDTO) throws EmailNotFoundException, UserNotFoundException;
}
