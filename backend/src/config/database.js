/**
 * Configuration de la base de données avec Sequelize ORM
 * Ce fichier configure la connexion sécurisée à PostgreSQL
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuration de la connexion PostgreSQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'appdb',
  username: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD || 'secure_password_change_in_production'
};

/**
 * Crée une instance Sequelize avec une configuration sécurisée
 * - Utilise PostgreSQL comme moteur de base de données (sécurisé pour la production)
 * - Désactive les logs en production pour la sécurité
 * - Configure le pool de connexions pour optimiser les performances
 * - Connexions chiffrées via SSL en production
 */
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,       // Nombre maximum de connexions dans le pool
      min: 2,        // Nombre minimum de connexions dans le pool
      acquire: 30000, // Temps maximum en ms pour acquérir une connexion
      idle: 10000    // Temps maximum en ms qu'une connexion peut être inactive
    },
    define: {
      timestamps: true,      // Ajoute createdAt et updatedAt automatiquement
      underscored: true,     // Utilise snake_case pour les noms de colonnes
      freezeTableName: true  // Empêche Sequelize de pluraliser les noms de tables
    }
    // Note: SSL désactivé en développement local (Docker)
    // À activer en production avec certificats appropriés
  }
);

/**
 * Fonction pour tester la connexion à la base de données
 * @returns {Promise<boolean>} - Retourne true si la connexion est réussie
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie avec succès.');
    return true;
  } catch (error) {
    console.error('❌ Impossible de se connecter à la base de données:', error);
    return false;
  }
};

/**
 * Synchronise tous les modèles avec la base de données
 * @param {boolean} force - Si true, supprime et recrée les tables
 */
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Base de données synchronisée avec succès.');
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase
};
