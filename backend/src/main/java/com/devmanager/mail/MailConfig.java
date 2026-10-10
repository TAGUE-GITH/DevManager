package com.devmanager.mail;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

// Choisit l'envoi des emails selon la configuration :
// avec une cle Brevo -> vrais emails ; sans cle -> emails affiches dans les logs
@Slf4j
@Configuration
public class MailConfig {

	@Bean
	public Mailer mailer(@Value("${app.mail.brevo-api-key}") String apiKey,
						 @Value("${app.mail.sender-email}") String senderEmail,
						 @Value("${app.mail.sender-name}") String senderName) {
		if (apiKey.isBlank()) {
			log.warn("BREVO_API_KEY absente : les emails seront affichés dans les logs");
			return new LoggingMailer();
		}
		return new BrevoMailer(RestClient.builder(), apiKey, senderEmail, senderName);
	}
}
