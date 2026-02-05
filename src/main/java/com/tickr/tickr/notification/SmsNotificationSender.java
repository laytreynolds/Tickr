package com.tickr.tickr.notification;

import com.tickr.tickr.domain.notification.Notification;
import com.tickr.tickr.domain.reminder.Reminder;
import com.tickr.tickr.dto.SmsNotification;
import com.tickr.tickr.dto.SmsRequest;
import com.tickr.tickr.http.HttpRequestBuilderRequest;

import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.List;

@Component
public class SmsNotificationSender implements NotificationSender {

    private static final String BASE_URL = "https://rest.clicksend.com/v3/sms/send";

    private final HttpRequestBuilderRequest httpRequestBuilderRequest;
    private final String username = "laytonbenreynolds@gmail.com";
    private final String password = "B41AB518-E526-6C8C-E82C-60387E81BDDA";

    public SmsNotificationSender(HttpRequestBuilderRequest httpRequestBuilderRequest) {
        this.httpRequestBuilderRequest = httpRequestBuilderRequest;
    }

    @Override
    public boolean supports(Notification notification) {
        return notification != null && notification.getChannel() == Reminder.Channel.SMS;
    }

    @Override
    public void send(Notification notification) {
        if (!supports(notification)) {
            throw new IllegalArgumentException("SmsNotificationSender does not support " + notification.getChannel());
        }
        SmsNotification sms = (SmsNotification) notification;
        String auth = buildBasicAuthHeader(username, password);
        SmsRequest request = new SmsRequest(List.of(sms));
        httpRequestBuilderRequest.postRequest(BASE_URL, auth, request);
    }

    private String buildBasicAuthHeader(String username, String password) {
        if (username == null || password == null) {
            throw new IllegalStateException("Username or Password not set for NotificationMessage Builder");
        }
        String originalInput = username + ":" + password;
        String encoded = Base64.getEncoder().encodeToString(originalInput.getBytes());
        return "Basic " + encoded;
    }
}
