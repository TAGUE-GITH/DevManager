package com.devmanager.auth;

// Envoie le lien de reinitialisation a l'utilisateur.
// Une interface permet de remplacer facilement l'envoi (log, email, SMS...) sans toucher a AuthService.
public interface PasswordResetNotifier {

	void sendResetLink(String email, String firstName, String resetLink);
}
