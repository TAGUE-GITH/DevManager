// L'API ne propose pas de lecture d'un message seul : la liste confie le message choisi a l'ecran de detail
const cache = new Map()

export const rememberMessage = (message, folder) => cache.set(String(message.id), { message, folder })
export const recallMessage = (id) => cache.get(String(id))
