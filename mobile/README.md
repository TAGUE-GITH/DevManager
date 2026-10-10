# DevManager Mobile

Application Android et iOS de DevManager, construite avec **React Native** et **Expo**. Elle utilise **la même API Spring Boot** que le site web : mêmes comptes, mêmes données, même compte de démonstration.

## Fonctionnalités (étape 1)

- Connexion, inscription d'une entreprise, mot de passe oublié
- Bouton **« Essayer la démo »**
- Session conservée de façon sécurisée (**SecureStore**, stockage chiffré du téléphone)
- **Français / anglais** (langue du téléphone par défaut, choix mémorisé) ; le serveur répond dans la même langue
- Thème **clair ou sombre** selon le réglage du téléphone

## Stack

Expo SDK 57, React Native, Expo Router (navigation par fichiers), Axios, i18next, expo-secure-store, react-native-svg.

## Lancer l'application

```bash
cd mobile
npm install
npx expo start
```

Scannez le QR code avec l'application **Expo Go** (Android) ou l'appareil photo (iOS). Par défaut, l'application utilise l'API de production : https://devmanager-api.onrender.com.

Pour utiliser un backend local, copiez `.env.example` en `.env.local` et indiquez l'adresse IP de votre ordinateur.

## Structure

```
mobile/src/
├── app/            Écrans (Expo Router) : connexion, inscription, espace de travail
├── api/            Client Axios (jeton JWT, langue) et appels à l'API
├── components/     Bouton, champ de saisie, logo, choix de la langue
├── context/        Session de l'utilisateur
├── i18n/           Traductions français et anglais
└── theme.js        Couleurs (thème clair et sombre)
```
