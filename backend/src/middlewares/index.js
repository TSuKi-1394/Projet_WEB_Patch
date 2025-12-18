/**
 * Middlewares de sécurité et utilitaires
 * Contient tous les middlewares personnalisés pour la sécurité
 */

/**
 * Middleware de logging des requêtes
 * Enregistre les informations de chaque requête pour le débogage
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @param {Function} next - Fonction pour passer au middleware suivant
 */
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  next();
};

/**
 * Middleware de gestion des erreurs globales
 * Capture toutes les erreurs non gérées et retourne une réponse sécurisée
 * @param {Error} err - Objet erreur
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @param {Function} next - Fonction pour passer au middleware suivant
 */
const errorHandler = (err, req, res, next) => {
  console.error('Erreur non gérée:', err);
  
  // Ne pas exposer les détails de l'erreur en production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    error: isDevelopment ? err.message : 'Une erreur interne est survenue',
    ...(isDevelopment && { stack: err.stack })
  });
};

/**
 * Middleware de validation du Content-Type
 * Vérifie que les requêtes POST/PUT ont un Content-Type valide
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @param {Function} next - Fonction pour passer au middleware suivant
 */
const validateContentType = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    
    // Accepte JSON et text/plain pour compatibilité
    if (contentType && 
        !contentType.includes('application/json') && 
        !contentType.includes('text/plain')) {
      return res.status(415).json({
        error: 'Content-Type non supporté. Utilisez application/json ou text/plain'
      });
    }
  }
  next();
};

/**
 * Middleware de nettoyage des entrées
 * Nettoie les caractères dangereux des paramètres de requête
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @param {Function} next - Fonction pour passer au middleware suivant
 */
const sanitizeInput = (req, res, next) => {
  // Nettoie les paramètres de query
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].trim();
      }
    }
  }
  
  // Nettoie les paramètres d'URL
  if (req.params) {
    for (const key in req.params) {
      if (typeof req.params[key] === 'string') {
        req.params[key] = req.params[key].trim();
      }
    }
  }
  
  next();
};

module.exports = {
  requestLogger,
  errorHandler,
  validateContentType,
  sanitizeInput
};
