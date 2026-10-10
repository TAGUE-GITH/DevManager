package com.devmanager.user;

import com.devmanager.common.ApiException;
import com.devmanager.image.Image;
import com.devmanager.image.ImageService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// Profil de l'utilisateur connecte : informations, photo et mot de passe
@Service
@RequiredArgsConstructor
@Transactional
public class ProfileService {

	private final CurrentUser currentUser;
	private final ImageService imageService;
	private final PasswordEncoder passwordEncoder;

	public record UpdateProfileRequest(
			@NotBlank(message = "Le prénom est obligatoire") @Size(max = 100, message = "100 caractères maximum") String firstName,
			@NotBlank(message = "Le nom est obligatoire") @Size(max = 100, message = "100 caractères maximum") String lastName,
			@Size(max = 100, message = "100 caractères maximum") String jobTitle) {
	}

	public record ImageRequest(@NotBlank(message = "L'image est obligatoire") String dataUrl) {
	}

	public record ChangePasswordRequest(
			@NotBlank(message = "Le mot de passe actuel est obligatoire") String currentPassword,
			@NotBlank(message = "Le nouveau mot de passe est obligatoire")
			@Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères") String newPassword) {
	}

	public UserResponse update(UpdateProfileRequest request) {
		User user = currentUser.get();
		user.setFirstName(request.firstName().trim());
		user.setLastName(request.lastName().trim());
		user.setJobTitle(request.jobTitle() == null || request.jobTitle().isBlank() ? null : request.jobTitle().trim());
		return UserResponse.from(user);
	}

	public UserResponse updateAvatar(ImageRequest request) {
		User user = currentUser.get();
		ensureNotDemo(user, "Les photos de profil sont désactivées dans le compte de démonstration.");
		Image previous = user.getAvatar();
		user.setAvatar(imageService.save(request.dataUrl()));
		imageService.delete(previous);
		return UserResponse.from(user);
	}

	public UserResponse removeAvatar() {
		User user = currentUser.get();
		Image previous = user.getAvatar();
		user.setAvatar(null);
		imageService.delete(previous);
		return UserResponse.from(user);
	}

	public void changePassword(ChangePasswordRequest request) {
		User user = currentUser.get();
		ensureNotDemo(user, "Le mot de passe du compte de démonstration ne peut pas être modifié.");
		if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
			throw ApiException.badRequest("Le mot de passe actuel est incorrect");
		}
		user.setPassword(passwordEncoder.encode(request.newPassword()));
	}

	// Le compte de demonstration est partage par tous les visiteurs : pas d'images ni de mot de passe modifiable
	static void ensureNotDemo(User user, String message) {
		if (user.getOrganization().isDemo()) {
			throw ApiException.forbidden(message);
		}
	}
}
