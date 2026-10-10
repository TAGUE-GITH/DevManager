package com.devmanager.user;

import com.devmanager.image.ImageService;
import com.devmanager.organization.Organization;
import com.devmanager.organization.Plan;

// Ce que l'API expose d'un utilisateur : jamais le mot de passe
public record UserResponse(Long id, String firstName, String lastName, String email, Role role, String jobTitle,
						   String avatarUrl, String organizationName, String organizationLogoUrl,
						   Plan organizationPlan, boolean demo) {

	public static UserResponse from(User user) {
		Organization organization = user.getOrganization();
		return new UserResponse(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getRole(),
				user.getJobTitle(), ImageService.url(user.getAvatar()), organization.getName(),
				ImageService.url(organization.getLogo()), organization.getPlan(), organization.isDemo());
	}
}
