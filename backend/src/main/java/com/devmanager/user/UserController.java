package com.devmanager.user;

import com.devmanager.common.ApiException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

	private final UserRepository userRepository;
	private final CurrentUser currentUser;

	public record UpdateRoleRequest(@NotNull(message = "Le rôle est obligatoire") Role role) {
	}

	// Profil de l'utilisateur connecte (identifie grace a son jeton JWT)
	@GetMapping("/me")
	public UserResponse me() {
		return UserResponse.from(currentUser.get());
	}

	// Liste des utilisateurs : sert a choisir les membres d'un projet ou le destinataire d'un message
	@GetMapping
	public List<UserResponse> findAll() {
		return userRepository.findAll(Sort.by("lastName", "firstName")).stream()
				.map(UserResponse::from)
				.toList();
	}

	@PatchMapping("/{id}/role")
	@PreAuthorize("hasRole('ADMIN')")
	@Transactional
	public UserResponse updateRole(@PathVariable Long id, @Valid @RequestBody UpdateRoleRequest request) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> ApiException.notFound("Utilisateur introuvable"));
		// Empeche l'administrateur de se retirer ses propres droits par erreur
		if (user.getId().equals(currentUser.get().getId())) {
			throw ApiException.badRequest("Vous ne pouvez pas modifier votre propre rôle");
		}
		user.setRole(request.role());
		return UserResponse.from(user);
	}
}
