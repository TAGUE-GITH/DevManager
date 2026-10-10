package com.devmanager.auth;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

// Implementation de demonstration : le lien est affiche dans les logs du serveur au lieu d'etre envoye par email
@Slf4j
@Component
public class LoggingPasswordResetNotifier implements PasswordResetNotifier {

	@Override
	public void sendResetLink(String email, String resetLink) {
		log.info("Lien de réinitialisation pour {} : {}", email, resetLink);
	}
}
