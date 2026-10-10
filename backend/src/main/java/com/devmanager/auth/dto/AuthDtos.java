package com.devmanager.auth.dto;

import com.devmanager.user.UserResponse;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Objets echanges avec le client pour l'authentification (les "records" Java sont immuables)
public final class AuthDtos {

	private AuthDtos() {
	}

	// Inscription d'une nouvelle entreprise : son createur en devient l'administrateur
	public record RegisterRequest(
			@NotBlank(message = "{validation.required}")
			@Size(max = 150, message = "{validation.size.max}") String companyName,
			@NotBlank(message = "{validation.required}") String firstName,
			@NotBlank(message = "{validation.required}") String lastName,
			@NotBlank(message = "{validation.required}") @Email(message = "{validation.email}") String email,
			@NotBlank(message = "{validation.required}")
			@Size(min = 8, message = "{validation.password.size}") String password) {
	}

	// Creation d'un compte a partir d'une invitation : l'email et l'entreprise viennent de l'invitation
	public record AcceptInvitationRequest(
			@NotBlank(message = "{validation.required}") String token,
			@NotBlank(message = "{validation.required}") String firstName,
			@NotBlank(message = "{validation.required}") String lastName,
			@NotBlank(message = "{validation.required}")
			@Size(min = 8, message = "{validation.password.size}") String password) {
	}

	public record LoginRequest(
			@NotBlank(message = "{validation.required}") @Email(message = "{validation.email}") String email,
			@NotBlank(message = "{validation.required}") String password) {
	}

	public record AuthResponse(String token, UserResponse user) {
	}

	public record ForgotPasswordRequest(
			@NotBlank(message = "{validation.required}") @Email(message = "{validation.email}") String email) {
	}

	public record ResetPasswordRequest(
			@NotBlank(message = "{validation.required}") String token,
			@NotBlank(message = "{validation.required}")
			@Size(min = 8, message = "{validation.password.size}") String newPassword) {
	}

	public record InfoResponse(String message) {
	}
}
