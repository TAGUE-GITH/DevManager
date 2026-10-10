package com.devmanager.auth;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

// Choisit l'envoi des emails selon la configuration :
// avec une cle Brevo -> vrais emails ; sans cle -> lien affiche dans les logs
@Slf4j
@Configuration
public class MailConfig {

	@Bean
	public PasswordResetNotifier passwordResetNotifier(
			@Value("${app.mail.brevo-api-key}") String apiKey,
			@Value("${app.mail.sender-email}") String senderEmail,
			@Value("${app.mail.sender-name}") String senderName,
			@Value("${app.password-reset.expiration-minutes}") long expirationMinutes) {
		if (apiKey.isBlank()) {
			log.warn("BREVO_API_KEY absente : les liens de réinitialisation seront affichés dans les logs");
			return new LoggingPasswordResetNotifier();
		}
		return new BrevoPasswordResetNotifier(RestClient.builder(), apiKey, senderEmail, senderName, expirationMinutes);
	}
}
