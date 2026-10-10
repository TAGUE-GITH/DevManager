package com.devmanager.user;

import com.devmanager.common.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

	private final UserRepository userRepository;

	// Profil de l'utilisateur connecte (identifie grace a son jeton JWT)
	@GetMapping("/me")
	public UserResponse me(@AuthenticationPrincipal UserDetails principal) {
		return userRepository.findByEmail(principal.getUsername())
				.map(UserResponse::from)
				.orElseThrow(() -> ApiException.notFound("Utilisateur introuvable"));
	}
}
