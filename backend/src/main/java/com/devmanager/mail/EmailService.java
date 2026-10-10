package com.devmanager.mail;

import com.devmanager.demo.DemoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

// Construit le contenu des emails de l'application (texte + HTML) et les confie au Mailer
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

	private final Mailer mailer;

	@Value("${app.password-reset.expiration-minutes}")
	private long resetExpirationMinutes;

	@Value("${app.invitation.expiration-days}")
	private long invitationExpirationDays;

	public void sendPasswordReset(String email, String firstName, String resetLink) {
		String text = """
				Bonjour %s,

				Vous avez demandé à réinitialiser votre mot de passe DevManager.
				Ouvrez ce lien pour choisir un nouveau mot de passe (valable %d minutes) :
				%s

				Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.
				""".formatted(firstName, resetExpirationMinutes, resetLink);

		String html = layout(
				"Bonjour %s,".formatted(escape(firstName)),
				"Vous avez demandé à réinitialiser votre mot de passe.",
				resetLink, "Choisir un nouveau mot de passe",
				"Ce lien est valable %d minutes et ne peut être utilisé qu'une seule fois. Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email."
						.formatted(resetExpirationMinutes));

		send(email, "Réinitialisation de votre mot de passe DevManager", html, text);
	}

	public void sendInvitation(String email, String inviterName, String organizationName, String invitationLink) {
		String text = """
				Bonjour,

				%s vous invite à rejoindre l'espace « %s » sur DevManager.
				Ouvrez ce lien pour créer votre compte (valable %d jours) :
				%s
				""".formatted(inviterName, organizationName, invitationExpirationDays, invitationLink);

		String html = layout(
				"Bonjour,",
				"<strong>%s</strong> vous invite à rejoindre l'espace <strong>%s</strong> sur DevManager."
						.formatted(escape(inviterName), escape(organizationName)),
				invitationLink, "Rejoindre l'équipe",
				"Cette invitation est valable %d jours.".formatted(invitationExpirationDays));

		send(email, "%s vous invite sur DevManager".formatted(inviterName), html, text);
	}

	// Les comptes de demonstration ont des adresses fictives : on n'envoie jamais rien a ces adresses
	private void send(String to, String subject, String html, String text) {
		if (to.endsWith(DemoService.EMAIL_DOMAIN)) {
			log.info("Email « {} » non envoyé : {} est une adresse de démonstration", subject, to);
			return;
		}
		mailer.send(to, subject, html, text);
	}

	// Les valeurs saisies par les utilisateurs (noms...) sont echappees pour eviter toute injection HTML
	private String escape(String value) {
		return HtmlUtils.htmlEscape(value);
	}

	private String layout(String greeting, String message, String link, String buttonLabel, String footnote) {
		return """
				<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;color:#1e293b">
				  <h2 style="color:#4f46e5">DevManager</h2>
				  <p>%s</p>
				  <p>%s</p>
				  <p style="margin:28px 0">
				    <a href="%s" style="background:#4f46e5;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">%s</a>
				  </p>
				  <p style="font-size:13px;color:#64748b">%s</p>
				</div>
				""".formatted(greeting, message, escape(link), buttonLabel, footnote);
	}
}
