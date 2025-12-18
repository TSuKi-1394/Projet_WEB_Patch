/**
 * Définition des routes API
 * Centralise toutes les routes de l'application
 * Utilise les contrôleurs pour traiter les requêtes
 */

const express = require('express');
const { userController, commentController } = require('../controllers');

const router = express.Router();

/**
 * Routes utilisateurs
 * Toutes les routes liées à la gestion des utilisateurs
 */

// GET /api/users - Récupère la liste des IDs utilisateurs
router.get('/users', (req, res) => userController.getAllUsers(req, res));

// GET /api/user/:id - Récupère un utilisateur par son ID (sécurisé, pas d'injection SQL)
router.get('/user/:id', (req, res) => userController.getUserById(req, res));

// POST /api/user - Crée un nouvel utilisateur
router.post('/user', (req, res) => userController.createUser(req, res));

// GET /api/populate - Peuple la base avec des utilisateurs aléatoires
router.get('/populate', (req, res) => userController.populateUsers(req, res));

/**
 * Routes commentaires
 * Toutes les routes liées à la gestion des commentaires
 */

// GET /api/comments - Récupère tous les commentaires
router.get('/comments', (req, res) => commentController.getAllComments(req, res));

// POST /api/comment - Crée un nouveau commentaire
router.post('/comment', (req, res) => commentController.createComment(req, res));

// DELETE /api/comment/:id - Supprime un commentaire
router.delete('/comment/:id', (req, res) => commentController.deleteComment(req, res));

module.exports = router;
