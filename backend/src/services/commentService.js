/**
 * Service Comment - Couche métier pour la gestion des commentaires
 * Contient toute la logique métier liée aux commentaires
 * Séparé du contrôleur pour respecter le principe de responsabilité unique
 */

const { Comment } = require('../models');

/**
 * Classe CommentService - Gère toutes les opérations liées aux commentaires
 */
class CommentService {
  
  /**
   * Récupère tous les commentaires triés par date décroissante
   * @returns {Promise<Array>} - Liste des commentaires
   */
  async getAllComments() {
    try {
      const comments = await Comment.findAll({
        order: [['id', 'DESC']], // Plus récents en premier
        attributes: ['id', 'content', 'createdAt']
      });
      
      // Retourne les commentaires avec contenu sanitisé
      return comments.map(comment => ({
        id: comment.id,
        content: this.escapeHtml(comment.content),
        createdAt: comment.createdAt
      }));
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des commentaires: ${error.message}`);
    }
  }

  /**
   * Crée un nouveau commentaire
   * @param {string} content - Contenu du commentaire
   * @returns {Promise<Object>} - Commentaire créé
   */
  async createComment(content) {
    try {
      // Validation du contenu
      if (!content || typeof content !== 'string') {
        throw new Error('Le contenu du commentaire est requis');
      }

      // Nettoie le contenu avant stockage
      const cleanContent = content.trim();
      
      if (cleanContent.length === 0) {
        throw new Error('Le commentaire ne peut pas être vide');
      }

      if (cleanContent.length > 5000) {
        throw new Error('Le commentaire est trop long (max 5000 caractères)');
      }

      // Crée le commentaire avec Sequelize (protection SQL injection automatique)
      const comment = await Comment.create({ content: cleanContent });
      
      return {
        id: comment.id,
        content: this.escapeHtml(comment.content),
        createdAt: comment.createdAt
      };
    } catch (error) {
      throw new Error(`Erreur lors de la création du commentaire: ${error.message}`);
    }
  }

  /**
   * Supprime un commentaire par son ID
   * @param {number} id - ID du commentaire à supprimer
   * @returns {Promise<boolean>} - True si supprimé, false sinon
   */
  async deleteComment(id) {
    try {
      const parsedId = parseInt(id, 10);
      if (isNaN(parsedId) || parsedId < 1) {
        throw new Error('ID commentaire invalide');
      }

      const deleted = await Comment.destroy({
        where: { id: parsedId }
      });
      
      return deleted > 0;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression du commentaire: ${error.message}`);
    }
  }

  /**
   * Fonction utilitaire pour échapper les caractères HTML
   * Protège contre les attaques XSS (Cross-Site Scripting)
   * @param {string} text - Texte à échapper
   * @returns {string} - Texte sécurisé
   */
  escapeHtml(text) {
    if (!text) return '';
    const htmlEntities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };
    return String(text).replace(/[&<>"'/]/g, char => htmlEntities[char]);
  }
}

module.exports = new CommentService();
