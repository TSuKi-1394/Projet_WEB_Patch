/**
 * Contrôleur User - Gère les requêtes HTTP liées aux utilisateurs
 * Couche de présentation qui délègue la logique métier au service
 */

const { userService } = require('../services');

/**
 * Classe UserController - Point d'entrée des requêtes HTTP utilisateurs
 */
class UserController {
  
  /**
   * GET /users - Récupère la liste des IDs utilisateurs
   * @param {Object} req - Objet requête Express
   * @param {Object} res - Objet réponse Express
   */
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUserIds();
      res.json(users);
    } catch (error) {
      console.error('Erreur contrôleur getAllUsers:', error.message);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des utilisateurs' 
      });
    }
  }

  /**
   * GET /user/:id - Récupère un utilisateur par son ID
   * @param {Object} req - Objet requête Express avec params.id
   * @param {Object} res - Objet réponse Express
   */
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      
      if (!user) {
        return res.status(404).json({ 
          error: 'Utilisateur non trouvé' 
        });
      }
      
      // Retourne l'utilisateur dans un tableau pour compatibilité frontend
      res.json([user]);
    } catch (error) {
      console.error('Erreur contrôleur getUserById:', error.message);
      res.status(400).json({ 
        error: error.message 
      });
    }
  }

  /**
   * POST /user - Crée un nouvel utilisateur
   * @param {Object} req - Objet requête Express avec body (name, password)
   * @param {Object} res - Objet réponse Express
   */
  async createUser(req, res) {
    try {
      const { name, password } = req.body;
      
      if (!name || !password) {
        return res.status(400).json({ 
          error: 'Nom et mot de passe requis' 
        });
      }
      
      const user = await userService.createUser({ name, password });
      res.status(201).json(user);
    } catch (error) {
      console.error('Erreur contrôleur createUser:', error.message);
      res.status(400).json({ 
        error: error.message 
      });
    }
  }

  /**
   * GET /populate - Peuple la base avec des utilisateurs aléatoires
   * @param {Object} req - Objet requête Express
   * @param {Object} res - Objet réponse Express
   */
  async populateUsers(req, res) {
    try {
      const users = await userService.populateRandomUsers(3);
      res.json({ 
        message: `${users.length} utilisateurs insérés avec succès`,
        users 
      });
    } catch (error) {
      console.error('Erreur contrôleur populateUsers:', error.message);
      res.status(500).json({ 
        error: 'Erreur lors du peuplement de la base' 
      });
    }
  }
}

module.exports = new UserController();
