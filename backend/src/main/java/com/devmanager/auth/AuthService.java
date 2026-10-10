package com.devmanager.auth;

import com.devmanager.auth.dto.AuthDtos.*;
import com.devmanager.common.ApiException;
import com.devmanager.invitation.Invitation;
import com.devmanager.invitation.InvitationService;
import com.devmanager.mail.EmailService;
import com.devmanager.organization.Organization;
import com.devmanager.organization.OrganizationRepository;
import com.devmanager.security.JwtService;
import com.devmanager.user.Role;
import com.devmanager.user.User;
import com.devmanager.user.UserRepository;
import com.devmanager.user.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final UserRepository userRepository;
	private final OrganizationRepository organizationRepository;
	private final PasswordResetTokenRepository resetTokenRepository;
	private final InvitationService invitationService;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final JwtService jwtService;
	private final EmailService emailService;

	@Value("${app.frontend-url}")
	private String frontendUrl;

	@Value("${app.password-reset.expiration-minutes}")
	private long resetExpirationMinutes;

	// Cree une nouvelle entreprise et son premier administrateur
	@Transactional
	public AuthResponse register(RegisterRequest request) {
		String email = normalize(request.email());
		ensureEmailAvailable(email);

		Organization organization = organizationRepository.save(Organization.builder()
				.name(request.companyName().trim())
				.build());

		User user = createUser(request.firstName(), request.lastName(), email, request.password(), Role.ADMIN, organization);
		return toAuthResponse(user);
	}

	// Cree le compte d'une personne invitee, dans l'entreprise et avec le role de l'invitation
	@Transactional
	public AuthResponse acceptInvitation(AcceptInvitationRequest request) {
		Invitation invitation = invitationService.getPending(request.token());
		ensureEmailAvailable(invitation.getEmail());

		User user = createUser(request.firstName(), request.lastName(), invitation.getEmail(), request.password(),
				invitation.getRole(), invitation.getOrganization());
		invitation.setAccepted(true);
		return toAuthResponse(user);
	}

	public AuthResponse login(LoginRequest request) {
		String email = normalize(request.email());
		// Leve BadCredentialsException (401) si l'email ou le mot de passe est faux
		authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));
		User user = userRepository.findByEmail(email).orElseThrow();
		return toAuthResponse(user);
	}

	@Transactional
	public void forgotPassword(ForgotPasswordRequest request) {
		// Si l'email est inconnu, on ne fait rien mais on ne le dit pas :
		// cela empeche un attaquant de deviner quels emails ont un compte
		userRepository.findByEmail(normalize(request.email())).ifPresent(user -> {
			PasswordResetToken resetToken = resetTokenRepository.save(PasswordResetToken.builder()
					.token(UUID.randomUUID().toString())
					.user(user)
					.expiresAt(LocalDateTime.now().plusMinutes(resetExpirationMinutes))
					.build());
			String link = frontendUrl + "/reset-password?token=" + resetToken.getToken();
			emailService.sendPasswordReset(user.getEmail(), user.getFirstName(), link);
		});
	}

	@Transactional
	public void resetPassword(ResetPasswordRequest request) {
		PasswordResetToken resetToken = resetTokenRepository.findByToken(request.token())
				.filter(token -> !token.isUsed() && !token.isExpired())
				.orElseThrow(() -> ApiException.badRequest("Lien de réinitialisation invalide ou expiré"));

		User user = resetToken.getUser();
		user.setPassword(passwordEncoder.encode(request.newPassword()));
		resetToken.setUsed(true);
	}

	private void ensureEmailAvailable(String email) {
		if (userRepository.existsByEmail(email)) {
			throw ApiException.conflict("Un compte existe déjà avec cet email");
		}
	}

	private User createUser(String firstName, String lastName, String email, String password, Role role,
							Organization organization) {
		return userRepository.save(User.builder()
				.firstName(firstName.trim())
				.lastName(lastName.trim())
				.email(email)
				.password(passwordEncoder.encode(password))
				.role(role)
				.organization(organization)
				.build());
	}

	private AuthResponse toAuthResponse(User user) {
		String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
		return new AuthResponse(token, UserResponse.from(user));
	}

	private String normalize(String email) {
		return email.trim().toLowerCase();
	}
}
