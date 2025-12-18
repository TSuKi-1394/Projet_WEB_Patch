/**
 * Point d'entrée des services
 * Centralise l'export de tous les services pour faciliter les imports
 */

const userService = require('./userService');
const commentService = require('./commentService');

module.exports = {
  userService,
  commentService
};
