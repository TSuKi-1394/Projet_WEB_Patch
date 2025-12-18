/**
 * Contrôleur Comment - Gère les requêtes HTTP liées aux commentaires
 * Couche de présentation qui délègue la logique métier au service
 */

const { commentService } = require('../services');

/**
 * Classe CommentController - Point d'entrée des requêtes HTTP commentaires
 */
class CommentController {
  
  /**
   * GET /comments - Récupère tous les commentaires
   * @param {Object} req - Objet requête Express
   * @param {Object} res - Objet réponse Express
   */
  async getAllComments(req, res) {
    try {
      const comments = await commentService.getAllComments();
      res.json(comments);
    } catch (error) {
      console.error('Erreur contrôleur getAllComments:', error.message);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des commentaires' 
      });
    }
  }

  /**
   * POST /comment - Crée un nouveau commentaire
   * @param {Object} req - Objet requête Express avec body.content ou body (texte brut)
   * @param {Object} res - Objet réponse Express
   */
  async createComment(req, res) {
    try {
      // Supporte à la fois JSON et texte brut pour compatibilité
      const content = typeof req.body === 'string' ? req.body : req.body.content;
      
      if (!content) {
        return res.status(400).json({ 
          error: 'Le contenu du commentaire est requis' 
        });
      }
      
      const comment = await commentService.createComment(content);
      res.status(201).json({ 
        success: true, 
        comment 
      });
    } catch (error) {
      console.error('Erreur contrôleur createComment:', error.message);
      res.status(400).json({ 
        error: error.message 
      });
    }
  }

  /**
   * DELETE /comment/:id - Supprime un commentaire
   * @param {Object} req - Objet requête Express avec params.id
   * @param {Object} res - Objet réponse Express
   */
  async deleteComment(req, res) {
    try {
      const { id } = req.params;
      const deleted = await commentService.deleteComment(id);
      
      if (!deleted) {
        return res.status(404).json({ 
          error: 'Commentaire non trouvé' 
        });
      }
      
      res.json({ 
        success: true, 
        message: 'Commentaire supprimé' 
      });
    } catch (error) {
      console.error('Erreur contrôleur deleteComment:', error.message);
      res.status(400).json({ 
        error: error.message 
      });
    }
  }
}

module.exports = new CommentController();
