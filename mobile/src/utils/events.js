// Petit bus d'evenements : previent la barre d'onglets quand des messages sont lus ou envoyes
const listeners = new Set()

export const onMessagesChanged = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const notifyMessagesChanged = () => listeners.forEach((listener) => listener())
