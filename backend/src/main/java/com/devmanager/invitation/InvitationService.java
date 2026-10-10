package com.devmanager.invitation;

import com.devmanager.common.ApiException;
import com.devmanager.invitation.InvitationDtos.InvitationInfoResponse;
import com.devmanager.invitation.InvitationDtos.InvitationRequest;
import com.devmanager.invitation.InvitationDtos.InvitationResponse;
import com.devmanager.mail.EmailService;
import com.devmanager.user.CurrentUser;
import com.devmanager.user.User;
import com.devmanager.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InvitationService {

	private final InvitationRepository invitationRepository;
	private final UserRepository userRepository;
	private final CurrentUser currentUser;
	private final EmailService emailService;

	@Value("${app.frontend-url}")
	private String frontendUrl;

	@Value("${app.invitation.expiration-days}")
	private long expirationDays;

	@Transactional
	public InvitationResponse invite(InvitationRequest request) {
		User admin = currentUser.get();
		String email = request.email().trim().toLowerCase();

		if (userRepository.existsByEmail(email)) {
			throw ApiException.conflict("Un compte existe déjà avec cet email");
		}

		// Une nouvelle invitation remplace celle encore en attente pour le meme email
		invitationRepository.findByOrganizationIdAndAcceptedFalseOrderByCreatedAtDesc(admin.getOrganization().getId())
				.stream()
				.filter(invitation -> invitation.getEmail().equals(email))
				.forEach(invitationRepository::delete);

		Invitation invitation = invitationRepository.save(Invitation.builder()
				.token(UUID.randomUUID().toString())
				.email(email)
				.role(request.role())
				.organization(admin.getOrganization())
				.invitedBy(admin)
				.expiresAt(LocalDateTime.now().plusDays(expirationDays))
				.build());

		emailService.sendInvitation(email, admin.getFirstName() + " " + admin.getLastName(),
				admin.getOrganization().getName(), linkFor(invitation));
		return toResponse(invitation);
	}

	public List<InvitationResponse> findPending() {
		return invitationRepository
				.findByOrganizationIdAndAcceptedFalseOrderByCreatedAtDesc(currentUser.get().getOrganization().getId())
				.stream()
				.map(this::toResponse)
				.toList();
	}

	@Transactional
	public void revoke(Long id) {
		Invitation invitation = invitationRepository.findById(id)
				.filter(i -> i.getOrganization().getId().equals(currentUser.get().getOrganization().getId()))
				.orElseThrow(() -> ApiException.notFound("Invitation introuvable"));
		invitationRepository.delete(invitation);
	}

	// Informations publiques affichees avant d'accepter l'invitation
	public InvitationInfoResponse getInfo(String token) {
		Invitation invitation = getPending(token);
		User inviter = invitation.getInvitedBy();
		return new InvitationInfoResponse(invitation.getEmail(), invitation.getRole(),
				invitation.getOrganization().getName(), inviter.getFirstName() + " " + inviter.getLastName());
	}

	public Invitation getPending(String token) {
		return invitationRepository.findByToken(token)
				.filter(Invitation::isPending)
				.orElseThrow(() -> ApiException.badRequest("Invitation invalide ou expirée"));
	}

	private InvitationResponse toResponse(Invitation invitation) {
		return new InvitationResponse(invitation.getId(), invitation.getEmail(), invitation.getRole(),
				invitation.getExpiresAt(), invitation.isExpired(), linkFor(invitation));
	}

	private String linkFor(Invitation invitation) {
		return frontendUrl + "/invitation?token=" + invitation.getToken();
	}
}
