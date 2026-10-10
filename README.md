# DevManager

Application web de gestion d'entreprise : gestion des projets, suivi budgétaire et messagerie interne.

## Stack technique

| Couche | Technologies |
|---|---|
| Frontend | React.js, Vite |
| Backend | Java 21, Spring Boot 3, Spring Security (JWT), Spring Data JPA |
| Base de données | PostgreSQL (production), H2 (développement) |
| Outils | Docker, Git, JUnit (TDD) |

## Structure

```
devmanager/
├── backend/    API REST Spring Boot
└── frontend/   Application React
```

## Lancer le projet en local

**Backend** (http://localhost:8080)

```bash
cd backend
./mvnw spring-boot:run
```

**Frontend** (http://localhost:5173)

```bash
cd frontend
npm install
npm run dev
```

## Auteur

TAGUE — [GitHub](https://github.com/TAGUE-GITH)
