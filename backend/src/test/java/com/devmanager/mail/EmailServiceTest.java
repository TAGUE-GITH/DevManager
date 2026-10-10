package com.devmanager.mail;

import com.devmanager.demo.DemoService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Locale;

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
		ResourceBundleMessageSource messages = new ResourceBundleMessageSource();
		messages.setBasename("messages");
		messages.setDefaultEncoding("UTF-8");
		messages.setFallbackToSystemLocale(false);

		emailService = new EmailService(fakeMailer, messages);
		ReflectionTestUtils.setField(emailService, "resetExpirationMinutes", 30L);
		ReflectionTestUtils.setField(emailService, "invitationExpirationDays", 7L);
		LocaleContextHolder.setLocale(Locale.FRENCH);
	}

	@AfterEach
	void resetLocale() {
		LocaleContextHolder.resetLocaleContext();
	}

	@Test
	void passwordReset_containsLinkAndExpiration() {
		emailService.sendPasswordReset("alice@devmanager.com", "Alice", "https://app/reset-password?token=abc");

		assertThat(subject).isEqualTo("Réinitialisation de votre mot de passe DevManager");
		assertThat(html).contains("https://app/reset-password?token=abc").contains("30 minutes");
		assertThat(text).contains("Bonjour Alice");
	}

	@Test
	void invitation_namesInviterAndCompany() {
		emailService.sendInvitation("bob@devmanager.com", "Alice Martin", "Martin SARL", "https://app/invitation?token=xyz");

		assertThat(subject).isEqualTo("Alice Martin vous invite sur DevManager");
		assertThat(html).contains("<strong>Martin SARL</strong>").contains("https://app/invitation?token=xyz");
	}

	@Test
	void emails_areWrittenInTheRequestLanguage() {
		LocaleContextHolder.setLocale(Locale.ENGLISH);

		emailService.sendInvitation("bob@devmanager.com", "Alice Martin", "Martin SARL", "https://app/invitation");

		assertThat(subject).isEqualTo("Alice Martin invites you to DevManager");
		assertThat(text).contains("Join the team").contains("valid for 7 days");
	}

	@Test
	void demoAddresses_neverReceiveEmails() {
		emailService.sendInvitation("paul.etoga" + DemoService.EMAIL_DOMAIN, "Jean", "Kamga Services", "https://app/invitation");

		assertThat(subject).isNull();
	}

	@Test
	void userInput_isHtmlEscaped() {
		emailService.sendInvitation("bob@devmanager.com", "<script>", "Entreprise", "https://app/invitation");

		assertThat(html).contains("&lt;script&gt;").doesNotContain("<script>");
	}
}
