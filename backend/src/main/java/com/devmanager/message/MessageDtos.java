package com.devmanager.message;

import com.devmanager.user.UserResponse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public final class MessageDtos {

	private MessageDtos() {
	}

	public record SendMessageRequest(
			@NotNull(message = "{validation.required}") Long recipientId,
			@NotBlank(message = "{validation.required}") @Size(max = 200, message = "{validation.size.max}") String subject,
			@NotBlank(message = "{validation.required}") @Size(max = 5000, message = "{validation.size.max}") String content) {
	}

	public record MessageResponse(Long id, UserResponse sender, UserResponse recipient, String subject,
								  String content, LocalDateTime sentAt, boolean read) {

		public static MessageResponse from(Message message) {
			return new MessageResponse(message.getId(), UserResponse.from(message.getSender()),
					UserResponse.from(message.getRecipient()), message.getSubject(), message.getContent(),
					message.getSentAt(), message.isRead());
		}
	}

	public record UnreadCountResponse(long count) {
	}
}
