package com.devmanager.auth;

import com.devmanager.auth.dto.AuthDtos.*;
import com.devmanager.common.ApiException;
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
	private final PasswordResetTokenRepository resetTokenRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final JwtService jwtService;
	private final PasswordResetNotifier resetNotifier;

	@Value("${app.frontend-url}")
	private String frontendUrl;

	@Value("${app.password-reset.expiration-minutes}")
	private long resetExpirationMinutes;

	@Transactional
	public AuthResponse register(RegisterRequest request) {
		String email = normalize(request.email());
		if (userRepository.existsByEmail(email)) {
			throw ApiException.conflict("Un compte existe déjà avec cet email");
		}

		// Le tout premier compte devient administrateur, les suivants sont employés
		Role role = userRepository.count() == 0 ? Role.ADMIN : Role.EMPLOYEE;

		User user = userRepository.save(User.builder()
				.firstName(request.firstName().trim())
				.lastName(request.lastName().trim())
				.email(email)
				.password(passwordEncoder.encode(request.password()))
				.role(role)
				.build());

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
			resetNotifier.sendResetLink(user.getEmail(), link);
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

	private AuthResponse toAuthResponse(User user) {
		String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
		return new AuthResponse(token, UserResponse.from(user));
	}

	private String normalize(String email) {
		return email.trim().toLowerCase();
	}
}
