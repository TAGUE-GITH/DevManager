// Adresse de l'API : le meme backend que le site web.
// En developpement, EXPO_PUBLIC_API_URL (fichier .env) peut pointer vers un backend local.
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://devmanager-api.onrender.com'
