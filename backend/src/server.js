/**
 * Serveur Express sécurisé
 * Point d'entrée principal de l'application backend
 * Implémente les bonnes pratiques de sécurité
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const routes = require('./routes');
const { testConnection, syncDatabase } = require('./config/database');
const { requestLogger, errorHandler, sanitizeInput } = require('./middlewares');

// Initialisation de l'application Express
const app = express();
const port = process.env.PORT || 8000;

/**
 * Configuration de Helmet pour les en-têtes de sécurité HTTP
 * Protège contre les attaques XSS, clickjacking, etc.
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

/**
 * Configuration CORS sécurisée
 * Limite les origines autorisées à accéder à l'API
 */
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // Cache preflight pendant 24h
};
app.use(cors(corsOptions));

/**
 * Configuration du rate limiting
 * Protège contre les attaques par force brute et DDoS
 */
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requêtes par fenêtre
  message: {
    error: 'Trop de requêtes, veuillez réessayer plus tard'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

/**
 * Parsers de body sécurisés
 * Limite la taille des requêtes pour éviter les attaques DoS
 */
app.use(express.json({ limit: '10kb' })); // Limite JSON à 10KB
app.use(express.text({ limit: '10kb' })); // Limite texte à 10KB
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

/**
 * Middlewares personnalisés
 */
app.use(requestLogger);  // Log toutes les requêtes
app.use(sanitizeInput);  // Nettoie les entrées

/**
 * Route de santé pour vérifier que le serveur fonctionne
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * Routes API principales
 * Toutes les routes sont préfixées par /api pour plus de clarté
 * Mais aussi accessibles sans préfixe pour compatibilité
 */
app.use('/api', routes);
app.use('/', routes); // Compatibilité avec l'ancien frontend

/**
 * Gestion des routes non trouvées (404)
 */
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée' 
  });
});

/**
 * Middleware de gestion des erreurs globales
 */
app.use(errorHandler);

/**
 * Fonction de démarrage du serveur
 * Initialise la connexion à la base de données avant de démarrer
 */
const startServer = async () => {
  try {
    // Test de la connexion à la base de données
    await testConnection();
    
    // Synchronisation des modèles avec la base (crée les tables si nécessaire)
    await syncDatabase(false); // false = ne pas supprimer les données existantes
    
    // Démarrage du serveur
    app.listen(port, () => {
      console.log(`🚀 Serveur sécurisé démarré sur le port ${port}`);
      console.log(`📍 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔒 CORS autorisé pour: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Démarrage de l'application
startServer();

module.exports = app;
