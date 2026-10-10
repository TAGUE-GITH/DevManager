package com.devmanager.user;

import com.devmanager.common.ApiException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
	private final ProfileService profileService;

	public record UpdateRoleRequest(@NotNull(message = "{validation.required}") Role role) {
	}

	// Profil de l'utilisateur connecte (identifie grace a son jeton JWT)
	@GetMapping("/me")
	public UserResponse me() {
		return UserResponse.from(currentUser.get());
	}

	@PutMapping("/me")
	public UserResponse updateProfile(@Valid @RequestBody ProfileService.UpdateProfileRequest request) {
		return profileService.update(request);
	}

	@PutMapping("/me/avatar")
	public UserResponse updateAvatar(@Valid @RequestBody ProfileService.ImageRequest request) {
		return profileService.updateAvatar(request);
	}

	@DeleteMapping("/me/avatar")
	public UserResponse removeAvatar() {
		return profileService.removeAvatar();
	}

	@PutMapping("/me/password")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void changePassword(@Valid @RequestBody ProfileService.ChangePasswordRequest request) {
		profileService.changePassword(request);
	}

	// Liste des utilisateurs : sert a choisir les membres d'un projet ou le destinataire d'un message
	@GetMapping
	public List<UserResponse> findAll() {
		return userRepository.findByOrganizationIdOrderByLastNameAscFirstNameAsc(organizationId()).stream()
				.map(UserResponse::from)
				.toList();
	}

	@PatchMapping("/{id}/role")
	@PreAuthorize("hasRole('ADMIN')")
	@Transactional
	public UserResponse updateRole(@PathVariable Long id, @Valid @RequestBody UpdateRoleRequest request) {
		User user = userRepository.findByIdAndOrganizationId(id, organizationId())
				.orElseThrow(() -> ApiException.notFound("error.user.notFound"));
		// Empeche l'administrateur de se retirer ses propres droits par erreur
		if (user.getId().equals(currentUser.get().getId())) {
			throw ApiException.badRequest("error.role.self");
		}
		user.setRole(request.role());
		return UserResponse.from(user);
	}

	private Long organizationId() {
		return currentUser.get().getOrganization().getId();
	}
}
