package com.devmanager.common;

import lombok.Getter;
import org.springframework.http.HttpStatus;

// Erreur metier renvoyee au client avec un code HTTP precis
@Getter
public class ApiException extends RuntimeException {

	private final HttpStatus status;

	public ApiException(HttpStatus status, String message) {
		super(message);
		this.status = status;
	}

	public static ApiException notFound(String message) {
		return new ApiException(HttpStatus.NOT_FOUND, message);
	}

	public static ApiException badRequest(String message) {
		return new ApiException(HttpStatus.BAD_REQUEST, message);
	}

	public static ApiException conflict(String message) {
		return new ApiException(HttpStatus.CONFLICT, message);
	}

	public static ApiException forbidden(String message) {
		return new ApiException(HttpStatus.FORBIDDEN, message);
	}

	// 402 : limite de l'offre atteinte, le client propose de passer a l'offre superieure
	public static ApiException paymentRequired(String message) {
		return new ApiException(HttpStatus.PAYMENT_REQUIRED, message);
	}
}
