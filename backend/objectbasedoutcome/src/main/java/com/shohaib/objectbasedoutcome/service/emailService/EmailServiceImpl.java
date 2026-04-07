package com.shohaib.objectbasedoutcome.service.emailService;

import com.shohaib.objectbasedoutcome.domain.model.EmailDetails;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements  EmailService{
    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String sender;

    @Override
    public String sendMail(EmailDetails emailDetails) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            String[] rec = emailDetails.getRecipient();
            int i = 0;
            for(i=0;i<rec.length;i++) {
                mailMessage.setFrom(sender);
                mailMessage.setTo(rec[i]);
                mailMessage.setText(emailDetails.getMsgBody());
                mailMessage.setSubject(emailDetails.getSubject());
                javaMailSender.send(mailMessage);
            }
            return "Mail Sent Successfully---- ";

        } catch (Exception e){
            return "Error while Sending Mail";
        }
    }

    @Override
    public void sendMailToResetPassword(String email, String firstName, String lastName, String link, String subject) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        mimeMessage.setFrom(sender);
        mimeMessage.addRecipients(Message.RecipientType.TO,email);
        mimeMessage.setSubject(subject);
        mimeMessage.setContent(
                "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color:#f9f9f9;padding:40px 0;width:100%\">" +
                        "<tr>" +
                        "<td align=\"center\">" +
                        "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color:#fff;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;font-size:16px;width:600px\">" +
                        "<tr>" +
                        "<td align=\"center\" style=\"background-color:#4a4ba1;padding:20px\">" +
                        "<h1 style=\"color:#fff;margin:0;font-size:24px;font-weight:700\">Password Reset Request</h1>" +
                        "</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td style=\"padding:30px;color:#333;line-height:1.6\">" +
                        "<p style=\"margin:0 0 15px\">Hello <strong>" + firstName + " " + lastName + "</strong>,</p>" +
                        "<p style=\"margin:0 0 15px\">You recently requested to reset your password. For security reasons, we cannot send you your old password. Instead, you can reset your password by clicking the button below.</p>" +
                        "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" style=\"margin:25px 0\">" +
                        "<tr>" +
                        "<td align=\"center\" style=\"background-color:#4a4ba1;border-radius:5px\">" +
                        "<a href=\"" + link + "\" style=\"display:inline-block;padding:12px 35px;font-size:16px;font-weight:700;color:#fff;text-decoration:none;border-radius:5px\">RESET PASSWORD</a>" +
                        "</td>" +
                        "</tr>" +
                        "</table>" +
                        "</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td align=\"center\" style=\"background-color:#f9f9f9;padding:20px;font-size:14px;color:#777;line-height:1.5;border-top:1px solid #e0e0e0\">" +
                        "<p style=\"margin:5px 0\">Phone: 01767028815</p>" +
                        "<p style=\"margin:5px 0\">Address: ShekerTek, Mohammadpur</p>" +
                        "</td>" +
                        "</tr>" +
                        "</table>" +
                        "</td>" +
                        "</tr>" +
                        "</table>",
                "text/html"
        );
        javaMailSender.send(mimeMessage);

    }
}
