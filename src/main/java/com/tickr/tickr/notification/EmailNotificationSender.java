package com.tickr.tickr.notification;

import com.tickr.tickr.domain.notification.Notification;
import com.tickr.tickr.domain.reminder.Reminder;
import com.tickr.tickr.dto.EmailNotification;

import org.springframework.stereotype.Component;

/**
 * Sends email notifications. Stub implementation for the EMAIL channel.
 */
@Component
public class EmailNotificationSender implements NotificationSender {

    @Override
    public boolean supports(Notification notification) {
        return notification != null && notification.getChannel() == Reminder.Channel.EMAIL;
    }

    @Override
    public void send(Notification notification) {
        if (!supports(notification)) {
            throw new IllegalArgumentException("EmailNotificationSender does not support " + notification.getChannel());
        }
        EmailNotification email = (EmailNotification) notification;
        // TODO: integrate with email provider (e.g. SendGrid, SES)
        // For now, no-op or log
    }
}
