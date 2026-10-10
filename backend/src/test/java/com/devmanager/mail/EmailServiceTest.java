package com.devmanager.mail;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

// Test unitaire du contenu des emails, avec un faux Mailer qui memorise le dernier email
class EmailServiceTest {

	private String subject;
	private String html;
	private String text;
	private EmailService emailService;

	@BeforeEach
	void setUp() {
		Mailer fakeMailer = (to, sentSubject, htmlContent, textContent) -> {
			subject = sentSubject;
			html = htmlContent;
			text = textContent;
		};
		emailService = new EmailService(fakeMailer);
		ReflectionTestUtils.setField(emailService, "resetExpirationMinutes", 30L);
		ReflectionTestUtils.setField(emailService, "invitationExpirationDays", 7L);
	}

	@Test
	void passwordReset_containsLinkAndExpiration() {
		emailService.sendPasswordReset("alice@devmanager.com", "Alice", "https://app/reset-password?token=abc");

		assertThat(html).contains("https://app/reset-password?token=abc").contains("30 minutes");
		assertThat(text).contains("Bonjour Alice");
	}

	@Test
	void invitation_namesInviterAndCompany() {
		emailService.sendInvitation("bob@devmanager.com", "Alice Martin", "Martin SARL", "https://app/invitation?token=xyz");

		assertThat(subject).isEqualTo("Alice Martin vous invite sur DevManager");
		assertThat(html).contains("Martin SARL").contains("https://app/invitation?token=xyz");
	}

	@Test
	void userInput_isHtmlEscaped() {
		emailService.sendInvitation("bob@devmanager.com", "<script>", "Entreprise", "https://app/invitation");

		assertThat(html).contains("&lt;script&gt;").doesNotContain("<script>");
	}
}
