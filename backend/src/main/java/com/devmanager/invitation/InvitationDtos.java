package com.devmanager.invitation;

import com.devmanager.user.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public final class InvitationDtos {

	private InvitationDtos() {
	}

	public record InvitationRequest(
			@NotBlank(message = "{validation.required}") @Email(message = "{validation.email}") String email,
			@NotNull(message = "{validation.required}") Role role) {
	}

	// Vue administrateur : le lien est inclus pour pouvoir le partager autrement que par email
	public record InvitationResponse(Long id, String email, Role role, LocalDateTime expiresAt, boolean expired,
									 String link) {
	}

	// Vue publique, affichee sur la page "Rejoindre l'equipe"
	public record InvitationInfoResponse(String email, Role role, String organizationName, String invitedBy) {
	}
}
