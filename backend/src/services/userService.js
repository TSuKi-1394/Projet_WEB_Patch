/**
 * Service User - Couche métier pour la gestion des utilisateurs
 * Contient toute la logique métier liée aux utilisateurs
 * Séparé du contrôleur pour respecter le principe de responsabilité unique
 */

const { User } = require('../models');
const axios = require('axios');

/**
 * Classe UserService - Gère toutes les opérations liées aux utilisateurs
 */
class UserService {
  
  /**
   * Récupère tous les utilisateurs (uniquement les IDs pour la sécurité)
   * @returns {Promise<Array>} - Liste des IDs des utilisateurs
   */
  async getAllUserIds() {
    try {
      const users = await User.findAll({
        attributes: ['id'], // Ne retourne que les IDs pour la sécurité
        order: [['id', 'ASC']]
      });
      return users;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
    }
  }

  /**
   * Récupère un utilisateur par son ID
   * @param {number} id - ID de l'utilisateur
   * @returns {Promise<Object|null>} - Utilisateur trouvé ou null
   */
  async getUserById(id) {
    try {
      // Validation de l'ID pour éviter les injections
      const parsedId = parseInt(id, 10);
      if (isNaN(parsedId) || parsedId < 1) {
        throw new Error('ID utilisateur invalide');
      }

      const user = await User.findByPk(parsedId, {
        attributes: ['id', 'name'] // Ne retourne pas le mot de passe
      });
      
      return user;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de l'utilisateur: ${error.message}`);
    }
  }

  /**
   * Crée un nouvel utilisateur
   * @param {Object} userData - Données de l'utilisateur (name, password)
   * @returns {Promise<Object>} - Utilisateur créé (sans mot de passe)
   */
  async createUser(userData) {
    try {
      const { name, password } = userData;
      
      // Création avec validation automatique par Sequelize
      const user = await User.create({ name, password });
      
      // Retourne l'utilisateur sans le mot de passe
      return user.toSafeObject();
    } catch (error) {
      throw new Error(`Erreur lors de la création de l'utilisateur: ${error.message}`);
    }
  }

  /**
   * Peuple la base de données avec des utilisateurs aléatoires
   * Utilise l'API randomuser.me pour générer des données de test
   * @param {number} count - Nombre d'utilisateurs à créer (par défaut 3)
   * @returns {Promise<Array>} - Liste des utilisateurs créés
   */
  async populateRandomUsers(count = 3) {
    try {
      // Récupère des utilisateurs aléatoires depuis l'API externe
      const requests = Array(count).fill().map(() => 
        axios.get('https://randomuser.me/api/')
      );
      
      const results = await Promise.all(requests);
      const createdUsers = [];

      // Crée chaque utilisateur dans la base de données
      for (const result of results) {
        const userData = result.data.results[0];
        const fullName = `${userData.name.first} ${userData.name.last}`;
        const password = userData.login.password;

        const user = await User.create({ name: fullName, password });
        createdUsers.push(user.toSafeObject());
      }

      return createdUsers;
    } catch (error) {
      throw new Error(`Erreur lors du peuplement de la base: ${error.message}`);
    }
  }
}

module.exports = new UserService();
