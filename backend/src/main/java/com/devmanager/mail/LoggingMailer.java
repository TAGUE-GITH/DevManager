package com.devmanager.mail;

import lombok.extern.slf4j.Slf4j;

// Utilise quand aucune cle Brevo n'est configuree (developpement, tests) :
// l'email est affiche dans les logs du serveur au lieu d'etre envoye
@Slf4j
public class LoggingMailer implements Mailer {

	@Override
	public void send(String to, String subject, String htmlContent, String textContent) {
		log.info("Email pour {} - {}\n{}", to, subject, textContent);
	}
}
