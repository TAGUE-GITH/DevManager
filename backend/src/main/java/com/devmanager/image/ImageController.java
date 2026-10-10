package com.devmanager.image;

import com.devmanager.common.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.Base64;

// Images publiques par leur identifiant aleatoire (une balise <img> ne peut pas envoyer de jeton JWT)
@RestController
@RequiredArgsConstructor
public class ImageController {

	private final ImageRepository imageRepository;

	@GetMapping("/api/images/{id}")
	public ResponseEntity<byte[]> get(@PathVariable String id) {
		Image image = imageRepository.findById(id).orElseThrow(() -> ApiException.notFound("Image introuvable"));
		// Une image n'est jamais modifiee (une nouvelle photo = un nouvel identifiant) : cache long
		return ResponseEntity.ok()
				.contentType(MediaType.parseMediaType(image.getContentType()))
				.cacheControl(CacheControl.maxAge(Duration.ofDays(365)).cachePublic().immutable())
				.body(Base64.getDecoder().decode(image.getData()));
	}
}
