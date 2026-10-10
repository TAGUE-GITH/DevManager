package com.devmanager.auth.dto;

import com.devmanager.user.UserResponse;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Objets echanges avec le client pour l'authentification (les "records" Java sont immuables)
public final class AuthDtos {

	private AuthDtos() {
	}

	public record RegisterRequest(
			@NotBlank(message = "Le prénom est obligatoire") String firstName,
			@NotBlank(message = "Le nom est obligatoire") String lastName,
			@NotBlank(message = "L'email est obligatoire") @Email(message = "Email invalide") String email,
			@NotBlank(message = "Le mot de passe est obligatoire")
			@Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères") String password) {
	}

	public record LoginRequest(
			@NotBlank(message = "L'email est obligatoire") @Email(message = "Email invalide") String email,
			@NotBlank(message = "Le mot de passe est obligatoire") String password) {
	}

	public record AuthResponse(String token, UserResponse user) {
	}

	public record ForgotPasswordRequest(
			@NotBlank(message = "L'email est obligatoire") @Email(message = "Email invalide") String email) {
	}

	public record ResetPasswordRequest(
			@NotBlank(message = "Le jeton est obligatoire") String token,
			@NotBlank(message = "Le mot de passe est obligatoire")
			@Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères") String newPassword) {
	}

	public record InfoResponse(String message) {
	}
}
