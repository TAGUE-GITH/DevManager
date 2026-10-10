package com.devmanager.image;

import com.devmanager.common.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Enregistrement des images recues sous forme de "data URL" (data:image/webp;base64,...).
 * Le navigateur les a deja redimensionnees (256 x 256) : on verifie le format et la taille avant d'enregistrer.
 */
@Service
@RequiredArgsConstructor
public class ImageService {

	static final int MAX_BASE64_LENGTH = 300_000;
	private static final Set<String> ALLOWED_TYPES = Set.of("image/png", "image/jpeg", "image/webp");
	private static final Pattern DATA_URL = Pattern.compile("^data:(image/[a-z]+);base64,([A-Za-z0-9+/=]+)$");

	private final ImageRepository imageRepository;

	@Transactional
	public Image save(String dataUrl) {
		Matcher matcher = DATA_URL.matcher(dataUrl == null ? "" : dataUrl);
		if (!matcher.matches() || !ALLOWED_TYPES.contains(matcher.group(1))) {
			throw ApiException.badRequest("error.image.format");
		}
		String base64 = matcher.group(2);
		if (base64.length() > MAX_BASE64_LENGTH) {
			throw ApiException.badRequest("error.image.tooLarge");
		}
		try {
			Base64.getDecoder().decode(base64);
		} catch (IllegalArgumentException e) {
			throw ApiException.badRequest("error.image.invalid");
		}
		return imageRepository.save(Image.builder()
				.id(UUID.randomUUID().toString())
				.contentType(matcher.group(1))
				.data(base64)
				.build());
	}

	@Transactional
	public void delete(Image image) {
		if (image != null) {
			imageRepository.delete(image);
		}
	}

	public static String url(Image image) {
		return image == null ? null : "/api/images/" + image.getId();
	}
}
