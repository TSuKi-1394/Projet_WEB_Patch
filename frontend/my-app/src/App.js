/**
 * Application React principale
 * Interface utilisateur pour interagir avec le backend sécurisé
 * Tous les commentaires sont en français pour la documentation
 */

import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

/**
 * URL de base de l'API backend
 * Utilise une variable d'environnement ou la valeur par défaut
 */
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Composant principal de l'application
 * Gère l'affichage des utilisateurs et des commentaires
 */
function App() {
  // État pour stocker la liste des IDs utilisateurs
  const [users, setUsers] = useState([]);
  // État pour l'ID saisi dans le formulaire de recherche
  const [queryId, setQueryId] = useState('');
  // État pour stocker le résultat de la recherche d'utilisateur
  const [queriedUser, setQueriedUser] = useState(null);
  // État pour stocker la liste des commentaires
  const [comments, setComments] = useState([]);
  // État pour le nouveau commentaire en cours de saisie
  const [newComment, setNewComment] = useState('');
  // État pour gérer les messages d'erreur
  const [error, setError] = useState('');

  /**
   * Effet exécuté au montage du composant
   * Charge la liste des utilisateurs et des commentaires
   */
  useEffect(() => {
    // Charge les IDs des utilisateurs
    axios.get(`${API_URL}/users`)
      .then(res => setUsers(res.data))
      .catch(err => console.error('Erreur chargement utilisateurs:', err.message));
    
    // Charge les commentaires
    loadComments();
  }, []);

  /**
   * Fonction pour charger tous les commentaires depuis l'API
   * Les commentaires sont déjà sanitisés côté serveur
   */
  const loadComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/comments`);
      setComments(response.data);
    } catch (err) {
      console.error('Erreur chargement commentaires:', err.message);
    }
  };

  /**
   * Gestionnaire de soumission du formulaire de recherche utilisateur
   * Utilise une route sécurisée avec paramètre d'URL (pas d'injection SQL)
   * @param {Event} e - Événement de soumission du formulaire
   */
  const handleQuery = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation côté client de l'ID
    const id = parseInt(queryId, 10);
    if (isNaN(id) || id < 1) {
      setError('Veuillez entrer un ID valide (nombre positif)');
      setQueriedUser(null);
      return;
    }

    try {
      // Utilise la route sécurisée avec paramètre d'URL
      const response = await axios.get(`${API_URL}/user/${id}`);
      setQueriedUser(response.data);
    } catch (err) {
      console.error('Erreur recherche utilisateur:', err.message);
      setQueriedUser(null);
      if (err.response?.status === 404) {
        setError('Utilisateur non trouvé');
      } else {
        setError('Erreur lors de la recherche');
      }
    }
  };

  /**
   * Gestionnaire de soumission du formulaire de commentaire
   * Envoie le commentaire au serveur pour stockage sécurisé
   * @param {Event} e - Événement de soumission du formulaire
   */
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    // Validation côté client
    if (!newComment.trim()) {
      return;
    }

    try {
      await axios.post(`${API_URL}/comment`, 
        { content: newComment },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setNewComment('');
      loadComments(); // Recharge les commentaires après ajout
    } catch (err) {
      console.error('Erreur envoi commentaire:', err.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        
        {/* Section de gestion des utilisateurs */}
        <section style={{ marginBottom: '3rem', border: '2px solid #61dafb', padding: '1rem', borderRadius: '8px' }}>
          <h3>IDs des utilisateurs dans la base</h3>
          
          {/* Affichage des IDs utilisateurs */}
          {users.map(u => <p key={u.id}>{u.id}</p>)}

          {/* Formulaire de recherche d'utilisateur par ID */}
          <form onSubmit={handleQuery} style={{ marginTop: '1rem' }}>
            <input
              type="number"
              min="1"
              placeholder="Entrez un ID utilisateur"
              value={queryId}
              onChange={(e) => setQueryId(e.target.value)}
              required
              style={{ padding: '0.5rem', marginRight: '0.5rem' }}
            />
            <button type="submit">Rechercher</button>
          </form>

          {/* Affichage des erreurs */}
          {error && (
            <p style={{ color: '#ff6b6b', marginTop: '0.5rem' }}>{error}</p>
          )}

          {/* Affichage du résultat de la recherche */}
          {queriedUser && queriedUser.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h3>Utilisateur trouvé :</h3>
              {queriedUser.map(u => (
                <p key={u.id}>
                  ID: {u.id} — Nom: {u.name}
                </p>
              ))}
            </div>
          )}
        </section>

        {/* Section des commentaires */}
        <section style={{ border: '2px solid #ff6b6b', padding: '1rem', borderRadius: '8px' }}>
          
          {/* Formulaire d'ajout de commentaire */}
          <form onSubmit={handleCommentSubmit} style={{ marginTop: '1rem' }}>
            <textarea
              placeholder="Entrez votre commentaire"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={5000}
              style={{ 
                width: '80%', 
                height: '80px', 
                marginBottom: '0.5rem',
                padding: '0.5rem',
                fontSize: '1rem'
              }}
              required
            />
            <br />
            <button type="submit">Publier le commentaire</button>
          </form>

          {/* Liste des commentaires */}
          <div style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '80%', margin: '2rem auto' }}>
            <h3>Commentaires :</h3>
            {comments.length === 0 ? (
              <p>Aucun commentaire pour le moment. Ajoutez-en un !</p>
            ) : (
              comments.map(comment => (
                <div 
                  key={comment.id} 
                  style={{ 
                    background: '#282c34', 
                    padding: '1rem', 
                    marginBottom: '1rem', 
                    borderRadius: '4px',
                    border: '1px solid #444'
                  }}
                >
                  {/* Le contenu est déjà sanitisé côté serveur */}
                  {comment.content}
                </div>
              ))
            )}
          </div>
        </section>
      </header>
    </div>
  );
}

export default App;