/**
 * Modèle Comment - Définition de la table des commentaires
 * Utilise Sequelize ORM pour une interaction sécurisée avec la base de données
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Définition du modèle Comment avec validation
 * - Validation du contenu pour éviter les entrées vides ou trop longues
 * - Protection contre les injections SQL via Sequelize
 */
const Comment = sequelize.define('comments', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identifiant unique du commentaire'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Le contenu du commentaire ne peut pas être vide'
      },
      len: {
        args: [1, 5000],
        msg: 'Le commentaire doit contenir entre 1 et 5000 caractères'
      }
    },
    comment: 'Contenu du commentaire'
  }
}, {
  // Options du modèle
  tableName: 'comments',
  timestamps: true
});

/**
 * Méthode pour sanitiser le contenu du commentaire
 * Échappe les caractères HTML dangereux pour éviter les XSS
 * @returns {Object} - Objet commentaire avec contenu sanitisé
 */
Comment.prototype.toSafeObject = function() {
  return {
    id: this.id,
    content: this.escapeHtml(this.content),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

/**
 * Fonction utilitaire pour échapper les caractères HTML
 * Protège contre les attaques XSS
 * @param {string} text - Texte à échapper
 * @returns {string} - Texte échappé
 */
Comment.prototype.escapeHtml = function(text) {
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  return text.replace(/[&<>"'/]/g, char => htmlEntities[char]);
};

module.exports = Comment;
