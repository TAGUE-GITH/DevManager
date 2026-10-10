package com.devmanager.message;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

	List<Message> findByRecipientIdOrderBySentAtDesc(Long recipientId);

	List<Message> findBySenderIdOrderBySentAtDesc(Long senderId);

	long countByRecipientIdAndReadFalse(Long recipientId);
}
