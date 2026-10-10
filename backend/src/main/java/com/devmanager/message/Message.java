package com.devmanager.message;

import com.devmanager.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "sender_id")
	private User sender;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "recipient_id")
	private User recipient;

	@Column(nullable = false)
	private String subject;

	@Column(nullable = false, length = 5000)
	private String content;

	@Builder.Default
	private LocalDateTime sentAt = LocalDateTime.now();

	@Column(name = "is_read")
	@Builder.Default
	private boolean read = false;
}
