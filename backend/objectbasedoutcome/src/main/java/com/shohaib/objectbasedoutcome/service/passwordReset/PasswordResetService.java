package com.shohaib.objectbasedoutcome.service.passwordReset;

import com.shohaib.objectbasedoutcome.domain.model.PasswordResets;
import com.shohaib.objectbasedoutcome.dto.model.PasswordResetDTO;
import com.shohaib.objectbasedoutcome.service.exception.handler.EmailNotFoundException;
import com.shohaib.objectbasedoutcome.service.exception.handler.PasswordDontMatchException;
import com.shohaib.objectbasedoutcome.service.exception.handler.UserNotFoundException;

public interface PasswordResetService {
    String sendResetEmail(PasswordResetDTO passwordResetDTO) throws EmailNotFoundException, UserNotFoundException;
    String verityEmailToken(PasswordResetDTO passwordResetDTO) throws PasswordDontMatchException;
    boolean changeUserPassword(PasswordResets passwordResets,String newPassword) throws PasswordDontMatchException;
}
