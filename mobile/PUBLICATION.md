# Publier l'application Android

Deux façons de rendre l'application disponible :

| | 1. Fichier APK (lien de téléchargement) | 2. Google Play Store |
|---|---|---|
| Coût | Gratuit | 25 $ une seule fois (compte développeur Google) |
| Délai | Environ 30 minutes | Plusieurs semaines (test fermé obligatoire de 14 jours) |
| Pour qui | Toute personne qui a le lien | Tout le monde, depuis le Play Store |
| Installation | Autoriser « sources inconnues » sur le téléphone | Normale, avec mises à jour automatiques |

Commencez par l'APK : c'est rapide, gratuit, et suffit pour un portfolio.

---

## Partie 1 : créer le compte Expo (gratuit)

1. Allez sur **https://expo.dev/signup**.
2. Choisissez un **nom d'utilisateur**, votre email et un mot de passe (ou « Continue with GitHub »).
3. Confirmez votre adresse en cliquant sur le lien reçu par email.

Le compte gratuit suffit pour construire l'application (les constructions gratuites passent dans une file d'attente).

## Partie 2 : construire l'APK

Dans un terminal, depuis le dossier du projet :

```bash
cd C:\Users\tague\Projets\devmanager\mobile
```

**1. Se connecter à Expo** (saisissez l'email ou le nom d'utilisateur et le mot de passe du compte) :

```bash
npx eas-cli@latest login
```

**2. Relier le projet à votre compte** (répondez **Y** pour créer le projet sur expo.dev). Cette commande ajoute un identifiant `projectId` dans `app.json` :

```bash
npx eas-cli@latest init
```

**3. Lancer la construction de l'APK :**

```bash
npx eas-cli@latest build -p android --profile preview
```

- À la question **« Generate a new Android Keystore? »**, répondez **Y** : Expo crée la clé de signature de l'application et la conserve en sécurité sur ses serveurs. **Ne la supprimez jamais** : elle sert à publier les mises à jour.
- La construction prend en général **10 à 30 minutes** (file d'attente du compte gratuit). Vous pouvez fermer le terminal : le suivi est aussi sur expo.dev, rubrique **Builds**.

**4. Récupérer le lien** : à la fin, le terminal affiche un lien vers la page de la construction (aussi visible sur expo.dev). Cette page contient un bouton **Install** et un QR code.

**5. Installer sur un téléphone Android** : ouvrez le lien sur le téléphone, téléchargez le fichier, puis autorisez l'installation (« Installer des applications inconnues » pour le navigateur). L'application utilise le serveur en ligne : mêmes comptes que le site et bouton « Essayer la démo ».

**6. Publier un lien permanent** : le lien de téléchargement d'Expo expire (14 jours sur le compte gratuit). Téléchargez l'APK, renommez-le `DevManager.apk`, puis créez une **Release GitHub** (https://github.com/TAGUE-GITH/DevManager/releases/new, tag `v1.0.0`, fichier joint). Le site et le README utilisent le lien permanent https://github.com/TAGUE-GITH/DevManager/releases/latest/download/DevManager.apk, qui pointe toujours vers la dernière Release.

> Après chaque modification de l'application, refaites l'étape 3, puis publiez une nouvelle Release (`v1.0.1`, `v1.1.0`…) avec le fichier `DevManager.apk`.

---

## Partie 3 : publier sur le Google Play Store

### Ce qu'exige Google (règles actuelles)

1. **Compte développeur Google Play** : 25 $ payés une seule fois sur **https://play.google.com/console**, avec vérification d'identité (pièce d'identité).
2. **Test fermé obligatoire** pour les comptes personnels créés après le 13 novembre 2023 : au moins **12 testeurs** inscrits **sans interruption pendant 14 jours** avant de pouvoir demander la mise en production. Google peut ensuite accepter ou refuser la demande.
3. **Suppression du compte** : une application qui permet de créer un compte doit proposer la suppression du compte et de ses données **dans l'application** et via **une page web**.
4. **Politique de confidentialité** : une page web publique.
5. **Fiche du Play Store** : icône 512 × 512, bannière 1024 × 500, au moins 2 captures d'écran, descriptions courte et longue, questionnaire de classification du contenu, formulaire « Sécurité des données ».

Les points 3, 4 et 5 demandent du développement : ils feront l'objet d'une prochaine étape (suppression du compte côté serveur, site et application, page de confidentialité, images de la fiche).

### Construire et envoyer l'application

```bash
npx eas-cli@latest build -p android --profile production
```

Cette commande produit un fichier **.aab** (format exigé par le Play Store). Le **premier envoi** se fait à la main dans la Play Console (Tester → Test fermé → Créer une version → importer le fichier .aab). Les versions suivantes peuvent être envoyées avec `npx eas-cli@latest submit -p android`.

### Sources

- [Expo : premier build avec EAS](https://docs.expo.dev/build/setup/)
- [Expo : construire un APK](https://docs.expo.dev/build-reference/apk/)
- [Google : test obligatoire pour les nouveaux comptes personnels](https://support.google.com/googleplay/android-developer/answer/14151465)
- [Google : obligation de suppression du compte](https://support.google.com/googleplay/android-developer/answer/13327111)
