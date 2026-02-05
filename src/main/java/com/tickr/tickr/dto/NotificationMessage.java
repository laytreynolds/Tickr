package com.tickr.tickr.dto;

import com.tickr.tickr.domain.reminder.Reminder;
import java.util.Base64;

public record NotificationMessage(
        String authorisation,
        String phoneNumber,
        String body) {

    public static class Builder {
        private String username;
        private String password;

        private String phoneNumber;
        private String body;

       

        public Builder withUsername(String username) {
            this.username = username;
            return this;
        }

        public Builder withPassword(String password) {
            this.password = password;
            return this;
        }

        public Builder withPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }

        public Builder withBody(String body) {
            this.body = body;
            return this;
        }

        private String buildBasicAuthHeader() {
            if (username == null || password == null) {
                throw new IllegalStateException("Username or Password not set for NotificationMessage Builder");
            }
            String originalInput = username + ":" + password;
            String encoded = Base64.getEncoder().encodeToString(originalInput.getBytes());
            return "Basic " + encoded;
        }

        public NotificationMessage build() {
            String authorisation = buildBasicAuthHeader();
            return new NotificationMessage(authorisation, phoneNumber, body);
        }
    }

    public static NotificationMessage from(Reminder reminder, String username, String password) {
        if (username == null || password == null) {
            throw new IllegalArgumentException("Username and password must not be null");
        }

        String phoneNumber = reminder.getUser().getPhoneNumber();
        String body = "Reminder: " + reminder.getEvent().getTitle() + " at " + reminder.getEvent().getStartTime();

        return new NotificationMessage.Builder()
                .withUsername(username)
                .withPassword(password)
                .withPhoneNumber(phoneNumber)
                .withBody(body)
                .build();
    }
}