package com.tickr.tickr.http;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Example usage of HttpRequestBuilder.
 * This class demonstrates how to use the HttpRequestBuilder for various HTTP
 * operations.
 */
@Component
@RequiredArgsConstructor
public class HttpRequestBuilderRequest {

    private final HttpRequestBuilder httpRequestBuilder;

    /**
     * Example: GET request with query parameters
     */
    public void getRequest(String url, String auth) {
        HttpRequestBuilder.HttpResponse response = httpRequestBuilder
                .url(url)
                .header("Accept", "application/json")
                .authorization(auth)
                .get()
                .execute();

        System.out.println("Status Code: " + response.getStatusCode());
        System.out.println("Response Body: " + response.getBody());
    }

    /**
     * Example: POST request with JSON body
     */
    public HttpRequestBuilder.HttpResponse postRequest(String url, String auth, Object body) {
        HttpRequestBuilder.HttpResponse response = httpRequestBuilder
                .url(url)
                .contentType("application/json")
                .authorization(auth)
                .body(body)
                .post()
                .execute();

        if (response.isSuccess()) {
            System.out.println("Request successful: " + response.getBody());
        } else {
            System.out.println("Request failed with status: " + response.getStatusCode());
        }

        return response;
    }

    /**
     * Example: POST request with custom headers
     */
    public void examplePostWithHeaders() {
        HttpRequestBuilder.HttpResponse response = httpRequestBuilder
                .url("https://rest.clicksend.com/v3/sms/send")
                .contentType("application/json")
                .authorization("Basic dXNlcm5hbWU6cGFzc3dvcmQ=")
                .header("X-Custom-Header", "custom-value")
                .body("{\"messages\": [{\"to\": \"+1234567890\", \"body\": \"Test message\"}]}")
                .post()
                .execute();

        System.out.println("Response Code: " + response.getStatusCode());
        System.out.println("Response Body: " + response.getBody());
    }

    /**
     * Example: PUT request
     */
    public void examplePutRequest() {
        Map<String, String> updateData = Map.of(
                "name", "Updated Name",
                "email", "updated@example.com");

        HttpRequestBuilder.HttpResponse response = httpRequestBuilder
                .url("https://api.example.com/users/123")
                .contentType("application/json")
                .body(updateData)
                .put()
                .execute();

        System.out.println("Update status: " + response.getStatusCode());
    }

    /**
     * Example: DELETE request
     */
    public void exampleDeleteRequest() {
        HttpRequestBuilder.HttpResponse response = httpRequestBuilder
                .url("https://api.example.com/users/123")
                .authorization("Bearer token123")
                .delete()
                .execute();

        System.out.println("Delete status: " + response.getStatusCode());
    }
}
