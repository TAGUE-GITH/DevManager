package com.devmanager.organization;

import com.devmanager.common.ApiException;
import com.devmanager.image.Image;
import com.devmanager.image.ImageService;
import com.devmanager.invitation.InvitationRepository;
import com.devmanager.invitation.Invitation;
import com.devmanager.organization.OrganizationDtos.*;
import com.devmanager.project.ProjectRepository;
import com.devmanager.user.CurrentUser;
import com.devmanager.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entreprise de l'utilisateur connecte : informations, offre, limites et abonnement.
 * Le paiement est simule (mode demonstration) : aucun prestataire n'est appele, aucun argent n'est preleve.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrganizationService {

	static final String CURRENCY = "XAF";

	private final OrganizationRepository organizationRepository;
	private final PaymentRepository paymentRepository;
	private final ProjectRepository projectRepository;
	private final UserRepository userRepository;
	private final InvitationRepository invitationRepository;
	private final CurrentUser currentUser;
	private final ImageService imageService;

	public OrganizationResponse getCurrent() {
		return toResponse(currentOrganization());
	}

	@Transactional
	public OrganizationResponse rename(UpdateOrganizationRequest request) {
		Organization organization = currentOrganization();
		organization.setName(request.name().trim());
		return toResponse(organization);
	}

	// Logo de l'entreprise (image deja redimensionnee par le navigateur)
	@Transactional
	public OrganizationResponse updateLogo(String dataUrl) {
		Organization organization = currentOrganization();
		if (organization.isDemo()) {
			throw ApiException.forbidden("error.demo.logo");
		}
		Image previous = organization.getLogo();
		organization.setLogo(imageService.save(dataUrl));
		imageService.delete(previous);
		return toResponse(organization);
	}

	@Transactional
	public OrganizationResponse removeLogo() {
		Organization organization = currentOrganization();
		Image previous = organization.getLogo();
		organization.setLogo(null);
		imageService.delete(previous);
		return toResponse(organization);
	}

	// Passage (ou renouvellement) en offre Pro pour un mois
	@Transactional
	public OrganizationResponse subscribe(SubscribeRequest request) {
		Organization organization = currentOrganization();
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime start = organization.getPlan() == Plan.PRO && organization.getCurrentPeriodEnd() != null
				&& organization.getCurrentPeriodEnd().isAfter(now)
				? organization.getCurrentPeriodEnd()
				: now;
		LocalDateTime periodEnd = start.plusMonths(1);

		paymentRepository.save(Payment.builder()
				.organization(organization)
				.amount(Plan.PRO.getMonthlyPrice())
				.currency(CURRENCY)
				.method(request.method())
				.reference("DEMO-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
				.periodEnd(periodEnd)
				.build());

		organization.setPlan(Plan.PRO);
		organization.setCurrentPeriodEnd(periodEnd);
		return toResponse(organization);
	}

	// Retour a l'offre Gratuite : les donnees existantes sont conservees, mais les limites s'appliquent aux ajouts
	@Transactional
	public OrganizationResponse cancel() {
		Organization organization = currentOrganization();
		organization.setPlan(Plan.FREE);
		organization.setCurrentPeriodEnd(null);
		return toResponse(organization);
	}

	public void checkCanCreateProject(Organization organization) {
		if (!organization.getPlan().allowsProjects(projectRepository.countByOrganizationId(organization.getId()))) {
			throw ApiException.paymentRequired("error.plan.projects", organization.getPlan().getMaxProjects());
		}
	}

	// Les invitations en attente comptent : elles reservent une place dans l'equipe
	public void checkCanAddMember(Organization organization, boolean includePendingInvitations) {
		long members = userRepository.countByOrganizationId(organization.getId());
		if (includePendingInvitations) {
			members += pendingInvitations(organization);
		}
		if (!organization.getPlan().allowsMembers(members)) {
			throw ApiException.paymentRequired("error.plan.members", organization.getPlan().getMaxMembers());
		}
	}

	private long pendingInvitations(Organization organization) {
		return invitationRepository.findByOrganizationIdAndAcceptedFalseOrderByCreatedAtDesc(organization.getId())
				.stream()
				.filter(Invitation::isPending)
				.count();
	}

	private Organization currentOrganization() {
		Long id = currentUser.get().getOrganization().getId();
		return organizationRepository.findById(id).orElseThrow();
	}

	private OrganizationResponse toResponse(Organization organization) {
		Plan plan = organization.getPlan();
		Usage usage = new Usage(
				projectRepository.countByOrganizationId(organization.getId()), plan.getMaxProjects(),
				userRepository.countByOrganizationId(organization.getId()) + pendingInvitations(organization),
				plan.getMaxMembers());
		return new OrganizationResponse(organization.getId(), organization.getName(), ImageService.url(organization.getLogo()), plan,
				Plan.PRO.getMonthlyPrice(), organization.getCurrentPeriodEnd(), usage,
				paymentRepository.findByOrganizationIdOrderByCreatedAtDesc(organization.getId()).stream()
						.map(PaymentResponse::from)
						.toList());
	}
}
