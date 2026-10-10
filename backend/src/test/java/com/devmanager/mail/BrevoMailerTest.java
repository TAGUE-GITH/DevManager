package com.devmanager.mail;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;

// Test unitaire : un faux serveur remplace l'API Brevo, aucun email n'est reellement envoye
class BrevoMailerTest {

	private MockRestServiceServer server;
	private BrevoMailer mailer;

	@BeforeEach
	void setUp() {
		RestClient.Builder builder = RestClient.builder();
		server = MockRestServiceServer.bindTo(builder).build();
		mailer = new BrevoMailer(builder, "cle-test", "contact@devmanager.com", "DevManager");
	}

	@Test
	void sendsEmailThroughBrevoApi() {
		server.expect(requestTo(BrevoMailer.API_URL))
				.andExpect(method(HttpMethod.POST))
				.andExpect(header("api-key", "cle-test"))
				.andExpect(jsonPath("$.sender.email").value("contact@devmanager.com"))
				.andExpect(jsonPath("$.to[0].email").value("alice@devmanager.com"))
				.andExpect(jsonPath("$.subject").value("Sujet"))
				.andRespond(withStatus(HttpStatus.CREATED));

		mailer.send("alice@devmanager.com", "Sujet", "<p>HTML</p>", "Texte");

		server.verify();
	}

	@Test
	void apiError_doesNotPropagate() {
		server.expect(requestTo(BrevoMailer.API_URL)).andRespond(withServerError());

		assertThatCode(() -> mailer.send("alice@devmanager.com", "Sujet", "<p>HTML</p>", "Texte"))
				.doesNotThrowAnyException();
	}
}
