package com.devmanager.security;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

// Test unitaire : pas besoin de demarrer Spring
class JwtServiceTest {

	private static final String SECRET = "cle-de-test-suffisamment-longue-pour-hmac-sha256";

	@Test
	void generatedToken_containsEmail() {
		JwtService jwtService = new JwtService(SECRET, 60_000);

		String token = jwtService.generateToken("alice@devmanager.com", "ADMIN");

		assertThat(jwtService.isValid(token)).isTrue();
		assertThat(jwtService.extractEmail(token)).isEqualTo("alice@devmanager.com");
	}

	@Test
	void expiredToken_isInvalid() {
		JwtService jwtService = new JwtService(SECRET, -1_000);

		String token = jwtService.generateToken("alice@devmanager.com", "ADMIN");

		assertThat(jwtService.isValid(token)).isFalse();
	}

	@Test
	void tokenSignedWithAnotherKey_isInvalid() {
		JwtService other = new JwtService("une-autre-cle-secrete-tout-aussi-longue-1234", 60_000);
		String token = other.generateToken("alice@devmanager.com", "ADMIN");

		assertThat(new JwtService(SECRET, 60_000).isValid(token)).isFalse();
	}
}
