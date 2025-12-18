# Dockerfile pour le backend Node.js sécurisé
# Image de production optimisée et sécurisée

# Étape 1 : Construction
# Utilise une image Node.js Alpine légère pour la construction
FROM node:20-alpine AS builder

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers de dépendances en premier (pour le cache Docker)
COPY package*.json ./

# Installe les dépendances de production uniquement
RUN npm ci --only=production && npm cache clean --force

# Étape 2 : Image de production
# Utilise une image minimale pour réduire la surface d'attaque
FROM node:20-alpine AS production

# Crée un utilisateur non-root pour la sécurité
# (évite d'exécuter le conteneur en tant que root)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Définit le répertoire de travail
WORKDIR /app

# Copie les dépendances depuis l'étape de construction
COPY --from=builder /app/node_modules ./node_modules

# Copie le code source de l'application
COPY --chown=nodejs:nodejs . .

# Crée le dossier data pour la base de données SQLite
RUN mkdir -p /app/data && chown -R nodejs:nodejs /app/data

# Définit les variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=8000

# Expose le port de l'application
EXPOSE 8000

# Passe à l'utilisateur non-root
USER nodejs

# Vérifie la santé du conteneur
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8000/health || exit 1

# Commande de démarrage
CMD ["node", "src/server.js"]
