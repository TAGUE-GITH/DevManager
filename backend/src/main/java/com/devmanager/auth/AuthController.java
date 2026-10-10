package com.devmanager.auth;

import com.devmanager.auth.dto.AuthDtos.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;
	private final MessageSource messageSource;

	@PostMapping("/register")
	@ResponseStatus(HttpStatus.CREATED)
	public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
		return authService.register(request);
	}

	@PostMapping("/accept-invitation")
	@ResponseStatus(HttpStatus.CREATED)
	public AuthResponse acceptInvitation(@Valid @RequestBody AcceptInvitationRequest request) {
		return authService.acceptInvitation(request);
	}

	@PostMapping("/demo")
	public AuthResponse demoLogin() {
		return authService.demoLogin();
	}

	@PostMapping("/login")
	public AuthResponse login(@Valid @RequestBody LoginRequest request) {
		return authService.login(request);
	}

	@PostMapping("/forgot-password")
	public InfoResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
		authService.forgotPassword(request);
		return info("info.forgotPassword");
	}

	@PostMapping("/reset-password")
	public InfoResponse resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
		authService.resetPassword(request);
		return info("info.passwordReset");
	}

	private InfoResponse info(String key) {
		return new InfoResponse(messageSource.getMessage(key, null, LocaleContextHolder.getLocale()));
	}
}
