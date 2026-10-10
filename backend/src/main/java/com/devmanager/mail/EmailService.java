package com.devmanager.mail;

import com.devmanager.demo.DemoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

/**
 * Construit le contenu des emails (texte + HTML) et les confie au Mailer.
 * Les textes viennent de messages.properties / messages_en.properties, dans la langue de la requete en cours.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

	private final Mailer mailer;
	private final MessageSource messageSource;

	@Value("${app.password-reset.expiration-minutes}")
	private long resetExpirationMinutes;

	@Value("${app.invitation.expiration-days}")
	private long invitationExpirationDays;

	public void sendPasswordReset(String email, String firstName, String resetLink) {
		String greetingText = message("email.reset.greeting", firstName);
		String intro = message("email.reset.intro");
		String button = message("email.reset.button");
		String footnote = message("email.reset.footnote", resetExpirationMinutes);

		String text = "%s\n\n%s\n%s : %s\n\n%s".formatted(greetingText, intro, button, resetLink, footnote);
		String html = layout(message("email.reset.greeting", escape(firstName)), escape(intro), resetLink, button, footnote);
		send(email, message("email.reset.subject"), html, text);
	}

	public void sendInvitation(String email, String inviterName, String organizationName, String invitationLink) {
		String greeting = message("email.invitation.greeting");
		String button = message("email.invitation.button");
		String footnote = message("email.invitation.footnote", invitationExpirationDays);

		String text = "%s\n\n%s\n%s : %s\n\n%s".formatted(greeting,
				message("email.invitation.intro", inviterName, "« " + organizationName + " »"), button, invitationLink, footnote);
		// Version HTML : noms echappes (saisis par les utilisateurs) et mis en gras
		String introHtml = message("email.invitation.intro",
				"<strong>" + escape(inviterName) + "</strong>", "<strong>" + escape(organizationName) + "</strong>");
		String html = layout(greeting, introHtml, invitationLink, button, footnote);
		send(email, message("email.invitation.subject", inviterName), html, text);
	}

	// Les comptes de demonstration ont des adresses fictives : on n'envoie jamais rien a ces adresses
	private void send(String to, String subject, String html, String text) {
		if (to.endsWith(DemoService.EMAIL_DOMAIN)) {
			log.info("Email « {} » non envoyé : {} est une adresse de démonstration", subject, to);
			return;
		}
		mailer.send(to, subject, html, text);
	}

	private String message(String key, Object... args) {
		return messageSource.getMessage(key, args, LocaleContextHolder.getLocale());
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
				""".formatted(greeting, message, escape(link), escape(buttonLabel), escape(footnote));
	}
}
