// Evenement emis par la messagerie quand le nombre de messages non lus change
export const MESSAGES_CHANGED = 'messages:changed'

export const notifyMessagesChanged = () => window.dispatchEvent(new Event(MESSAGES_CHANGED))
