# DevManager Mobile

Application Android et iOS de DevManager, construite avec **React Native** et **Expo**. Elle utilise **la même API Spring Boot** que le site web : mêmes comptes, mêmes données, même compte de démonstration.

**📱 Télécharger : [DevManager.apk](https://github.com/TAGUE-GITH/DevManager/releases/latest/download/DevManager.apk)** (Android, version 1.0.0)

## Fonctionnalités

- Connexion, inscription d'une entreprise, mot de passe oublié et bouton **« Essayer la démo »**
- Barre d'onglets : **Accueil, Projets, Tâches, Messages, Profil**
- **Tableau de bord** : chiffres clés, budget et dépenses par projet, avancement des tâches, dépenses par catégorie (même palette que le site, adaptée aux daltoniens)
- **Projets** : filtres par statut, recherche, jauge de budget (alerte en cas de dépassement), détail avec tâches par colonne, budget, équipe et dépenses
- **Tâches** : changement de statut par une liste de choix (remplace le glisser-déposer du Kanban), page « Mes tâches »
- **Réunion vidéo** : ouverture de la salle Jitsi du projet
- **Messagerie** : messages reçus et envoyés, lecture (compteur de non lus sur l'onglet), réponse et nouveau message
- **Profil** : rôle, entreprise, offre, choix de la langue, liens vers le site web et l'aide
- Session conservée de façon sécurisée (**SecureStore**, stockage chiffré du téléphone)
- **Français / anglais** (langue du téléphone par défaut, choix mémorisé) ; le serveur répond dans la même langue
- Thème **clair ou sombre** selon le réglage du téléphone
- « Tirer pour actualiser » sur chaque écran

La création de projets, la gestion de l'équipe et l'abonnement restent sur le site web (réservés aux administrateurs).

## Stack

Expo SDK 57, React Native, Expo Router (navigation par fichiers et onglets), Axios, i18next, expo-secure-store, react-native-svg, @expo/vector-icons. Code vérifié par ESLint (`npx expo lint`).

## Lancer l'application

```bash
cd mobile
npm install
npx expo start
```

Scannez le QR code avec l'application **Expo Go** (Android) ou l'appareil photo (iOS). Par défaut, l'application utilise l'API de production : https://devmanager-api.onrender.com.

Pour créer le fichier Android (APK) et publier l'application, suivez le guide [PUBLICATION.md](PUBLICATION.md).

Pour utiliser un backend local, copiez `.env.example` en `.env.local` et indiquez l'adresse IP de votre ordinateur.

## Structure

```
mobile/src/
├── app/            Écrans (Expo Router) : connexion, onglets, détail projet, message, rédaction
├── api/            Client Axios (jeton JWT, langue) et appels à l'API
├── components/     Bouton, champ, logo, langue, tâche ; ui/ : carte, pastille, jauge, avatar, listes de choix
├── hooks/          Chargement des données (au retour sur l'écran, tirer pour actualiser)
├── context/        Session de l'utilisateur
├── i18n/           Traductions français et anglais
└── theme.js        Couleurs (thème clair et sombre)
```
