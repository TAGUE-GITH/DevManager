package com.devmanager.user;

import com.devmanager.common.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

// Donne acces a l'utilisateur connecte depuis n'importe quel service
@Component
@RequiredArgsConstructor
public class CurrentUser {

	private final UserRepository userRepository;

	public User get() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		return userRepository.findByEmail(authentication.getName())
				.orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifié"));
	}
}
