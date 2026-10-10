package com.devmanager.user;

import com.devmanager.organization.Plan;

// Ce que l'API expose d'un utilisateur : jamais le mot de passe
public record UserResponse(Long id, String firstName, String lastName, String email, Role role,
						   String organizationName, Plan organizationPlan, boolean demo) {

	public static UserResponse from(User user) {
		return new UserResponse(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getRole(),
				user.getOrganization().getName(), user.getOrganization().getPlan(), user.getOrganization().isDemo());
	}
}
