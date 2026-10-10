package com.devmanager.message;

import com.devmanager.message.MessageDtos.MessageResponse;
import com.devmanager.message.MessageDtos.SendMessageRequest;
import com.devmanager.message.MessageDtos.UnreadCountResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

	private final MessageService messageService;

	@GetMapping("/inbox")
	public List<MessageResponse> inbox() {
		return messageService.inbox();
	}

	@GetMapping("/sent")
	public List<MessageResponse> sent() {
		return messageService.sent();
	}

	@GetMapping("/unread-count")
	public UnreadCountResponse unreadCount() {
		return new UnreadCountResponse(messageService.unreadCount());
	}

	@GetMapping("/{id}")
	public MessageResponse findById(@PathVariable Long id) {
		return messageService.findById(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public MessageResponse send(@Valid @RequestBody SendMessageRequest request) {
		return messageService.send(request);
	}

	@PatchMapping("/{id}/read")
	public MessageResponse markAsRead(@PathVariable Long id) {
		return messageService.markAsRead(id);
	}
}
