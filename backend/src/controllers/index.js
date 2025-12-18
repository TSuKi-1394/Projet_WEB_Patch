/**
 * Point d'entrée des contrôleurs
 * Centralise l'export de tous les contrôleurs pour faciliter les imports
 */

const userController = require('./userController');
const commentController = require('./commentController');

module.exports = {
  userController,
  commentController
};
