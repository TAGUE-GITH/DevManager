package com.devmanager.user;

// Ce que l'API expose d'un utilisateur : jamais le mot de passe
public record UserResponse(Long id, String firstName, String lastName, String email, Role role) {

	public static UserResponse from(User user) {
		return new UserResponse(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getRole());
	}
}
