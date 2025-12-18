# Dockerfile pour le frontend React
# Image de production optimisée avec Nginx

# Étape 1 : Construction de l'application React
FROM node:20-alpine AS builder

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers de dépendances en premier (pour le cache Docker)
COPY package*.json ./

# Installe les dépendances
RUN npm ci && npm cache clean --force

# Copie le reste du code source
COPY . .

# Construit l'application React pour la production
RUN npm run build

# Étape 2 : Serveur Nginx pour servir l'application
FROM nginx:alpine AS production

# Supprime la configuration par défaut de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copie notre configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/

# Copie les fichiers de build depuis l'étape de construction
COPY --from=builder /app/build /usr/share/nginx/html

# Crée un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nginx-user && \
    adduser -S nginx-user -u 1001 && \
    chown -R nginx-user:nginx-user /usr/share/nginx/html && \
    chown -R nginx-user:nginx-user /var/cache/nginx && \
    chown -R nginx-user:nginx-user /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx-user:nginx-user /var/run/nginx.pid

# Expose le port 80
EXPOSE 80

# Vérifie la santé du conteneur
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Commande de démarrage de Nginx
CMD ["nginx", "-g", "daemon off;"]
