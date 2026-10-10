package com.devmanager.common;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Erreur metier renvoyee au client avec un code HTTP precis.
 * Le message est une cle de traduction (ex. "error.project.notFound"), traduite dans la langue du client
 * par GlobalExceptionHandler a partir de messages.properties / messages_en.properties.
 */
@Getter
public class ApiException extends RuntimeException {

	private final HttpStatus status;
	private final transient Object[] args;

	public ApiException(HttpStatus status, String messageKey, Object... args) {
		super(messageKey);
		this.status = status;
		this.args = args;
	}

	public static ApiException notFound(String messageKey) {
		return new ApiException(HttpStatus.NOT_FOUND, messageKey);
	}

	public static ApiException badRequest(String messageKey) {
		return new ApiException(HttpStatus.BAD_REQUEST, messageKey);
	}

	public static ApiException conflict(String messageKey) {
		return new ApiException(HttpStatus.CONFLICT, messageKey);
	}

	public static ApiException forbidden(String messageKey) {
		return new ApiException(HttpStatus.FORBIDDEN, messageKey);
	}

	// 402 : limite de l'offre atteinte, le client propose de passer a l'offre superieure
	public static ApiException paymentRequired(String messageKey, Object... args) {
		return new ApiException(HttpStatus.PAYMENT_REQUIRED, messageKey, args);
	}
}
