package com.devmanager.mail;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

import java.util.List;
import java.util.Map;

// Envoie les emails via l'API HTTP de Brevo (https://www.brevo.com).
// Une API HTTP plutot que SMTP : les hebergeurs gratuits bloquent souvent les ports SMTP.
@Slf4j
public class BrevoMailer implements Mailer {

	static final String API_URL = "https://api.brevo.com/v3/smtp/email";

	private final RestClient restClient;
	private final String senderEmail;
	private final String senderName;

	public BrevoMailer(RestClient.Builder builder, String apiKey, String senderEmail, String senderName) {
		this.restClient = builder.defaultHeader("api-key", apiKey).build();
		this.senderEmail = senderEmail;
		this.senderName = senderName;
	}

	@Override
	public void send(String to, String subject, String htmlContent, String textContent) {
		Map<String, Object> body = Map.of(
				"sender", Map.of("email", senderEmail, "name", senderName),
				"to", List.of(Map.of("email", to)),
				"subject", subject,
				"htmlContent", htmlContent,
				"textContent", textContent);
		try {
			restClient.post()
					.uri(API_URL)
					.contentType(MediaType.APPLICATION_JSON)
					.body(body)
					.retrieve()
					.toBodilessEntity();
			log.info("Email « {} » envoyé à {}", subject, to);
		} catch (RestClientResponseException e) {
			// Brevo a repondu par une erreur : on journalise son code et son message, sans trace technique
			log.error("Échec de l'envoi de l'email « {} » à {} : Brevo a répondu {} {}",
					subject, to, e.getStatusCode().value(), e.getResponseBodyAsString());
		} catch (RestClientException e) {
			// Brevo injoignable (reseau...). Un echec d'envoi ne doit pas faire echouer la requete de l'utilisateur
			log.error("Échec de l'envoi de l'email « {} » à {} : {}", subject, to, e.getMessage());
		}
	}
}
