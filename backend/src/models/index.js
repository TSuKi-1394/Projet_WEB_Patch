/**
 * Point d'entrée des modèles Sequelize
 * Centralise l'export de tous les modèles pour faciliter les imports
 */

const User = require('./User');
const Comment = require('./Comment');
const { sequelize } = require('../config/database');

/**
 * Définition des associations entre les modèles
 * À étendre si besoin d'ajouter des relations (ex: User hasMany Comments)
 */
const setupAssociations = () => {
  // Exemple d'association (décommenter si besoin) :
  // User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
  // Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });
};

// Initialise les associations
setupAssociations();

module.exports = {
  User,
  Comment,
  sequelize
};
