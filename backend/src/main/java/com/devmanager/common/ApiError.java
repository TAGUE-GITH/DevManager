package com.devmanager.common;

import java.time.LocalDateTime;
import java.util.Map;

public record ApiError(int status, String message, Map<String, String> errors, LocalDateTime timestamp) {

	public ApiError(int status, String message) {
		this(status, message, Map.of(), LocalDateTime.now());
	}
}
