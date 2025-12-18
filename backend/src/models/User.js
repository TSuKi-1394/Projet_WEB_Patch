/**
 * Modèle User - Définition de la table des utilisateurs
 * Utilise Sequelize ORM pour une interaction sécurisée avec la base de données
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

/**
 * Définition du modèle User avec validation et sécurité
 * - Le mot de passe est hashé automatiquement avant sauvegarde
 * - Validation des champs pour éviter les injections
 */
const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identifiant unique de l\'utilisateur'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Le nom ne peut pas être vide'
      },
      len: {
        args: [2, 255],
        msg: 'Le nom doit contenir entre 2 et 255 caractères'
      }
    },
    comment: 'Nom complet de l\'utilisateur'
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Le mot de passe ne peut pas être vide'
      },
      len: {
        args: [4, 255],
        msg: 'Le mot de passe doit contenir au moins 4 caractères'
      }
    },
    comment: 'Mot de passe hashé de l\'utilisateur'
  }
}, {
  // Options du modèle
  tableName: 'users',
  timestamps: true,
  
  // Hooks pour le hashage automatique du mot de passe
  hooks: {
    /**
     * Hook exécuté avant la création d'un utilisateur
     * Hash le mot de passe avec bcrypt pour la sécurité
     */
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    /**
     * Hook exécuté avant la mise à jour d'un utilisateur
     * Re-hash le mot de passe si modifié
     */
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

/**
 * Méthode d'instance pour vérifier le mot de passe
 * @param {string} password - Mot de passe en clair à vérifier
 * @returns {Promise<boolean>} - True si le mot de passe correspond
 */
User.prototype.verifyPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * Méthode pour retourner l'utilisateur sans le mot de passe
 * Utilisé pour les réponses API sécurisées
 */
User.prototype.toSafeObject = function() {
  return {
    id: this.id,
    name: this.name,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = User;
