# 🔐 Projet Web Sécurisé - IPSSI S4 Pentest & OWASP

Application web full-stack sécurisée développée avec Node.js, Express, React et PostgreSQL, démontrant les bonnes pratiques de sécurité web.

## 🎯 Objectifs du Projet

- ✅ Sécuriser le serveur web avec les meilleures pratiques
- ✅ Conteneuriser tous les services avec Docker
- ✅ Implémenter une architecture en couches (Services/Contrôleurs)
- ✅ Établir une connexion sécurisée à la base de données PostgreSQL
- ✅ Utiliser un ORM (Sequelize) pour prévenir les injections SQL

## 🏗️ Architecture

```
┌─────────────┐
│  Frontend   │  React + Nginx (Port 3000)
│   (Nginx)   │
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────┐
│   Backend   │  Node.js + Express (Port 8000)
│  (Express)  │  - Helmet, CORS, Rate Limiting
└──────┬──────┘
       │ Sequelize ORM
       ▼
┌─────────────┐
│  Database   │  PostgreSQL 16 (Port 5432)
│ (PostgreSQL)│  - Conteneur isolé
└─────────────┘
```

## 🚀 Démarrage Rapide

### Prérequis

- Docker et Docker Compose
- macOS/Linux : Colima (alternative à Docker Desktop)
- Au moins 2 GB RAM libre

### Installation

```bash
# 1. Cloner le repository
git clone <url-du-repo>
cd Projet_WEB_Patch

# 2. Créer le fichier .env depuis le template
cp backend/.env.example backend/.env

# 3. ⚠️ IMPORTANT : Modifier les secrets dans backend/.env
nano backend/.env
# Changer : DB_PASSWORD, SECRET_KEY

# 4. Démarrer l'application
docker-compose up --build

# L'application sera disponible sur :
# - Frontend : http://localhost:3000
# - Backend API : http://localhost:8000
# - PostgreSQL : localhost:5432 (interne)
```

### Arrêt de l'application

```bash
# Arrêter les services
docker-compose down

# Arrêter et supprimer les données (⚠️ supprime la DB)
docker-compose down -v
```

## 📁 Structure du Projet

```
Projet_WEB_Patch/
├── backend/                 # Backend Node.js + Express
│   ├── src/
│   │   ├── config/         # Configuration (database.js)
│   │   ├── controllers/    # Contrôleurs HTTP
│   │   ├── models/         # Modèles Sequelize (User, Comment)
│   │   ├── services/       # Logique métier
│   │   ├── middlewares/    # Middlewares de sécurité
│   │   ├── routes/         # Routes API
│   │   └── server.js       # Point d'entrée
│   ├── .env.example        # Template de configuration
│   ├── Dockerfile
│   └── package.json
│
├── frontend/my-app/        # Frontend React
│   ├── src/
│   │   ├── App.js          # Composant principal
│   │   └── index.js
│   ├── nginx.conf          # Configuration Nginx
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml       # Orchestration des 3 services
├── .gitignore              # Fichiers à ne pas commiter
├── README.md               # Ce fichier
├── DOCUMENTATION.md        # Documentation complète
└── GIT_BEST_PRACTICES.md   # Bonnes pratiques Git
```

## 🔒 Sécurité Implémentée

### Protection contre les vulnérabilités OWASP Top 10

- ✅ **Injection SQL** : Sequelize ORM avec requêtes paramétrées
- ✅ **XSS (Cross-Site Scripting)** : Échappement HTML automatique
- ✅ **Broken Authentication** : Bcrypt pour hashage des mots de passe (10 rounds)
- ✅ **Sensitive Data Exposure** : Variables d'environnement, HTTPS recommandé
- ✅ **XML External Entities (XXE)** : Pas de parsing XML
- ✅ **Broken Access Control** : Validation des entrées
- ✅ **Security Misconfiguration** : Helmet pour headers HTTP sécurisés
- ✅ **CSRF** : CORS configuré avec liste blanche
- ✅ **Using Components with Known Vulnerabilities** : Dépendances à jour
- ✅ **Insufficient Logging** : Winston pour logs structurés

### Middlewares de Sécurité

```javascript
✅ Helmet          # En-têtes HTTP sécurisés
✅ CORS            # Contrôle des origines
✅ Rate Limiting   # Protection DDoS (100 req/15min)
✅ Input Validation # express-validator
✅ Content-Type    # Validation des types MIME
```

## 🌐 API Endpoints

### Utilisateurs

```
GET    /users          # Liste des IDs utilisateurs
GET    /user/:id       # Récupérer un utilisateur
POST   /user           # Créer un utilisateur
GET    /populate       # Générer 3 utilisateurs aléatoires
```

### Commentaires

```
GET    /comments       # Liste des commentaires (DESC)
POST   /comment        # Créer un commentaire
DELETE /comment/:id    # Supprimer un commentaire
```

### Health Check

```
GET    /health         # Statut du serveur
```

## 🧪 Tests

Voir le cahier de tests complet dans [DOCUMENTATION.md](DOCUMENTATION.md#-cahier-de-tests) avec 39 tests couvrant :

- Tests d'infrastructure Docker
- Tests de la base de données PostgreSQL
- Tests des endpoints API
- Tests de sécurité
- Tests d'intégration

### Exécuter les tests manuels

```bash
# Test de santé
curl http://localhost:8000/health

# Créer un utilisateur
curl -X POST http://localhost:8000/user \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","password":"securepass"}'

# Récupérer les utilisateurs
curl http://localhost:8000/users
```

## 📦 Technologies

| Catégorie | Technologies |
|-----------|-------------|
| **Backend** | Node.js 20, Express 4.18, Sequelize 6.35 |
| **Base de données** | PostgreSQL 16 Alpine |
| **Frontend** | React 19, Nginx Alpine |
| **Sécurité** | Helmet 7.1, bcrypt 5.1, express-rate-limit 7.1 |
| **Infrastructure** | Docker, Docker Compose |

## 🛠️ Développement

### Sans Docker

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
npm run dev  # Lance avec nodemon
```

**Frontend:**
```bash
cd frontend/my-app
npm install
npm start    # Lance sur port 3000
```

### Logs

```bash
# Voir tous les logs
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f database
```

## 🔐 Configuration des Secrets

### ⚠️ AVANT LA PREMIÈRE UTILISATION

1. **Copier le template :**
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Générer des secrets forts :**
   ```bash
   # Générer une SECRET_KEY
   openssl rand -base64 32
   
   # Générer un mot de passe DB
   openssl rand -base64 16
   ```

3. **Modifier backend/.env :**
   ```bash
   DB_PASSWORD=VotreMotDePasseSecurise123!
   SECRET_KEY=VotreCleSecrete...
   ```

### ⚠️ NE JAMAIS COMMITER .env

Le fichier `.env` contient des secrets et **NE DOIT JAMAIS** être commité dans Git.

Voir [GIT_BEST_PRACTICES.md](GIT_BEST_PRACTICES.md) pour plus de détails.

## 📚 Documentation

- **[DOCUMENTATION.md](DOCUMENTATION.md)** - Documentation technique complète (1500+ lignes)
  - Architecture détaillée
  - Documentation de chaque fichier
  - Guide d'installation et d'utilisation
  - API Endpoints
  - Cahier de tests (39 tests)
  - Dépannage

- **[GIT_BEST_PRACTICES.md](GIT_BEST_PRACTICES.md)** - Bonnes pratiques Git et sécurité
  - Ce qui doit/ne doit pas être commité
  - Configuration .gitignore
  - Hooks Git de sécurité
  - Workflow de branches

## 🤝 Contribution

Ce projet est un exemple pédagogique pour le cours de Pentest & OWASP à l'IPSSI.

### Workflow Git

```bash
# 1. Créer une branche feature
git checkout -b feature/nom-fonctionnalite

# 2. Développer et commiter
git add .
git commit -m "✨ feat: Description"

# 3. Pousser
git push origin feature/nom-fonctionnalite
```

### Messages de Commit

```
✨ feat:     Nouvelle fonctionnalité
🐛 fix:      Correction de bug
📝 docs:     Documentation
♻️  refactor: Refactoring
✅ test:     Ajout de tests
🔒 security: Correctif de sécurité
🐳 docker:   Modifications Docker
```

## 🐛 Dépannage

### Problème: Port déjà utilisé

```bash
# Trouver le processus
lsof -i :8000

# Tuer le processus
kill -9 <PID>
```

### Problème: Docker daemon not running

```bash
# macOS avec Colima
colima start
```

### Problème: Connexion PostgreSQL refusée

```bash
# Redémarrer les services
docker-compose restart database

# Supprimer les volumes et redémarrer
docker-compose down -v
docker-compose up --build
```

## 📄 Licence

Projet éducatif - IPSSI 2025

## 👥 Auteur

Projet réalisé dans le cadre du cours **Pentest & OWASP - IPSSI S4**

---

**Date de création :** 18 décembre 2025  
**Version :** 1.0.0
