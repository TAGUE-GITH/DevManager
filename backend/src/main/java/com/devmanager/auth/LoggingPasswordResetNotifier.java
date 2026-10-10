package com.devmanager.auth;

import lombok.extern.slf4j.Slf4j;

// Utilise quand aucune cle Brevo n'est configuree (developpement, tests) :
// le lien est affiche dans les logs du serveur au lieu d'etre envoye par email
@Slf4j
public class LoggingPasswordResetNotifier implements PasswordResetNotifier {

	@Override
	public void sendResetLink(String email, String firstName, String resetLink) {
		log.info("Lien de réinitialisation pour {} : {}", email, resetLink);
	}
}
