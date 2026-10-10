package com.devmanager.auth;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.util.HtmlUtils;

import java.util.List;
import java.util.Map;

// Envoie l'email de reinitialisation via l'API HTTP de Brevo (https://www.brevo.com).
// Une API HTTP plutot que SMTP : les hebergeurs gratuits bloquent souvent les ports SMTP.
@Slf4j
public class BrevoPasswordResetNotifier implements PasswordResetNotifier {

	static final String API_URL = "https://api.brevo.com/v3/smtp/email";

	private final RestClient restClient;
	private final String senderEmail;
	private final String senderName;
	private final long expirationMinutes;

	public BrevoPasswordResetNotifier(RestClient.Builder builder, String apiKey, String senderEmail,
									  String senderName, long expirationMinutes) {
		this.restClient = builder.defaultHeader("api-key", apiKey).build();
		this.senderEmail = senderEmail;
		this.senderName = senderName;
		this.expirationMinutes = expirationMinutes;
	}

	@Override
	public void sendResetLink(String email, String firstName, String resetLink) {
		Map<String, Object> body = Map.of(
				"sender", Map.of("email", senderEmail, "name", senderName),
				"to", List.of(Map.of("email", email)),
				"subject", "Réinitialisation de votre mot de passe DevManager",
				"htmlContent", htmlContent(firstName, resetLink),
				"textContent", textContent(firstName, resetLink));
		try {
			restClient.post()
					.uri(API_URL)
					.contentType(MediaType.APPLICATION_JSON)
					.body(body)
					.retrieve()
					.toBodilessEntity();
			log.info("Email de réinitialisation envoyé à {}", email);
		} catch (RestClientException e) {
			// L'erreur n'est pas renvoyee au client : la reponse reste la meme que l'email existe ou non
			log.error("Échec de l'envoi de l'email de réinitialisation à {}", email, e);
		}
	}

	private String textContent(String firstName, String resetLink) {
		return """
				Bonjour %s,

				Vous avez demandé à réinitialiser votre mot de passe DevManager.
				Ouvrez ce lien pour choisir un nouveau mot de passe (valable %d minutes) :
				%s

				Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.
				""".formatted(firstName, expirationMinutes, resetLink);
	}

	private String htmlContent(String firstName, String resetLink) {
		// Le prenom vient de l'utilisateur : il est echappe pour eviter toute injection HTML
		String name = HtmlUtils.htmlEscape(firstName);
		String link = HtmlUtils.htmlEscape(resetLink);
		return """
				<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;color:#1e293b">
				  <h2 style="color:#4f46e5">DevManager</h2>
				  <p>Bonjour %s,</p>
				  <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
				  <p style="margin:28px 0">
				    <a href="%s" style="background:#4f46e5;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">
				      Choisir un nouveau mot de passe
				    </a>
				  </p>
				  <p style="font-size:13px;color:#64748b">Ce lien est valable %d minutes et ne peut être utilisé qu'une seule fois.</p>
				  <p style="font-size:13px;color:#64748b">Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.</p>
				</div>
				""".formatted(name, link, expirationMinutes);
	}
}
