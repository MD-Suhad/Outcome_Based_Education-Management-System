package com.shohaib.objectbasedoutcome.service.emailService;

import com.shohaib.objectbasedoutcome.domain.model.EmailDetails;
import jakarta.mail.MessagingException;

public interface EmailService {

    String sendMail(EmailDetails emailDetails);
    void sendMailToResetPassword(String email, String firstName, String lastName, String link, String subject ) throws MessagingException;

}
