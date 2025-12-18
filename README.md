# 🔐 Projet Web Sécurisé - IPSSI S4 Pentest & OWASP

Application web full-stack sécurisée développée avec Node.js, Express, React et PostgreSQL, démontrant les bonnes pratiques de sécurité web.

## 🎯 Objectifs du Projet

- Sécuriser le serveur web avec les meilleures pratiques
- Conteneuriser tous les services avec Docker
- Implémenter une architecture en couches (Services/Contrôleurs)
- Établir une connexion sécurisée à la base de données PostgreSQL
- Utiliser un ORM (Sequelize) pour prévenir les injections SQL

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

- **Injection SQL** : Sequelize ORM avec requêtes paramétrées
- **XSS (Cross-Site Scripting)** : Échappement HTML automatique
- **Broken Authentication** : Bcrypt pour hashage des mots de passe (10 rounds)
- **Sensitive Data Exposure** : Variables d'environnement, HTTPS recommandé
- **XML External Entities (XXE)** : Pas de parsing XML
- **Broken Access Control** : Validation des entrées
- **Security Misconfiguration** : Helmet pour headers HTTP sécurisés
- **CSRF** : CORS configuré avec liste blanche
- **Using Components with Known Vulnerabilities** : Dépendances à jour
- **Insufficient Logging** : Winston pour logs structurés

### Middlewares de Sécurité

```javascript
Helmet          # En-têtes HTTP sécurisés
CORS            # Contrôle des origines
Rate Limiting   # Protection DDoS (100 req/15min)
Input Validation # express-validator
Content-Type    # Validation des types MIME
```

## 🌐 API Endpoints

### Utilisateurs

```html
GET    /users          # Liste des IDs utilisateurs
GET    /user/:id       # Récupérer un utilisateur
POST   /user           # Créer un utilisateur
GET    /populate       # Générer 3 utilisateurs aléatoires
```

### Commentaires

```html
GET    /comments       # Liste des commentaires (DESC)
POST   /comment        # Créer un commentaire
DELETE /comment/:id    # Supprimer un commentaire
```

### Health Check

```html
GET    /health         # Statut du serveur
```

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

## 📄 Licence

Projet éducatif - IPSSI 2025