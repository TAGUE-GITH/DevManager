package com.devmanager.message;

import com.devmanager.common.ApiException;
import com.devmanager.message.MessageDtos.MessageResponse;
import com.devmanager.message.MessageDtos.SendMessageRequest;
import com.devmanager.user.CurrentUser;
import com.devmanager.user.User;
import com.devmanager.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// Un message n'est visible que par son expediteur et son destinataire
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MessageService {

	private final MessageRepository messageRepository;
	private final UserRepository userRepository;
	private final CurrentUser currentUser;

	public List<MessageResponse> inbox() {
		return messageRepository.findByRecipientIdOrderBySentAtDesc(currentUser.get().getId()).stream()
				.map(MessageResponse::from)
				.toList();
	}

	public List<MessageResponse> sent() {
		return messageRepository.findBySenderIdOrderBySentAtDesc(currentUser.get().getId()).stream()
				.map(MessageResponse::from)
				.toList();
	}

	public long unreadCount() {
		return messageRepository.countByRecipientIdAndReadFalse(currentUser.get().getId());
	}

	public MessageResponse findById(Long id) {
		Message message = getMessage(id);
		User user = currentUser.get();
		if (!isSender(user, message) && !isRecipient(user, message)) {
			throw ApiException.forbidden("Vous n'avez pas accès à ce message");
		}
		return MessageResponse.from(message);
	}

	@Transactional
	public MessageResponse send(SendMessageRequest request) {
		User sender = currentUser.get();
		if (sender.getId().equals(request.recipientId())) {
			throw ApiException.badRequest("Vous ne pouvez pas vous envoyer un message");
		}
		// Le destinataire doit appartenir a la meme entreprise
		User recipient = userRepository.findByIdAndOrganizationId(request.recipientId(), sender.getOrganization().getId())
				.orElseThrow(() -> ApiException.notFound("Destinataire introuvable"));

		Message message = messageRepository.save(Message.builder()
				.sender(sender)
				.recipient(recipient)
				.subject(request.subject().trim())
				.content(request.content())
				.build());
		return MessageResponse.from(message);
	}

	@Transactional
	public MessageResponse markAsRead(Long id) {
		Message message = getMessage(id);
		if (!isRecipient(currentUser.get(), message)) {
			throw ApiException.forbidden("Seul le destinataire peut marquer ce message comme lu");
		}
		message.setRead(true);
		return MessageResponse.from(message);
	}

	private Message getMessage(Long id) {
		return messageRepository.findById(id)
				.orElseThrow(() -> ApiException.notFound("Message introuvable"));
	}

	private boolean isSender(User user, Message message) {
		return message.getSender().getId().equals(user.getId());
	}

	private boolean isRecipient(User user, Message message) {
		return message.getRecipient().getId().equals(user.getId());
	}
}
