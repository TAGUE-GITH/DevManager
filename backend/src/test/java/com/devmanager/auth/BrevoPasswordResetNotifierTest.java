package com.devmanager.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;

// Test unitaire : un faux serveur remplace l'API Brevo, aucun email n'est reellement envoye
class BrevoPasswordResetNotifierTest {

	private MockRestServiceServer server;
	private BrevoPasswordResetNotifier notifier;

	@BeforeEach
	void setUp() {
		RestClient.Builder builder = RestClient.builder();
		server = MockRestServiceServer.bindTo(builder).build();
		notifier = new BrevoPasswordResetNotifier(builder, "cle-test", "contact@devmanager.com", "DevManager", 30);
	}

	@Test
	void sendsEmailThroughBrevoApi() {
		server.expect(requestTo(BrevoPasswordResetNotifier.API_URL))
				.andExpect(method(HttpMethod.POST))
				.andExpect(header("api-key", "cle-test"))
				.andExpect(jsonPath("$.sender.email").value("contact@devmanager.com"))
				.andExpect(jsonPath("$.to[0].email").value("alice@devmanager.com"))
				.andExpect(jsonPath("$.htmlContent").value(containsString("https://app/reset-password?token=abc")))
				.andRespond(withStatus(HttpStatus.CREATED));

		notifier.sendResetLink("alice@devmanager.com", "Alice", "https://app/reset-password?token=abc");

		server.verify();
	}

	@Test
	void escapesHtmlInFirstName() {
		server.expect(requestTo(BrevoPasswordResetNotifier.API_URL))
				.andExpect(jsonPath("$.htmlContent").value(containsString("&lt;script&gt;")))
				.andRespond(withStatus(HttpStatus.CREATED));

		notifier.sendResetLink("alice@devmanager.com", "<script>", "https://app/reset");

		server.verify();
	}

	@Test
	void apiError_doesNotPropagate() {
		server.expect(requestTo(BrevoPasswordResetNotifier.API_URL)).andRespond(withServerError());

		assertThatCode(() -> notifier.sendResetLink("alice@devmanager.com", "Alice", "https://app/reset"))
				.doesNotThrowAnyException();
	}
}
