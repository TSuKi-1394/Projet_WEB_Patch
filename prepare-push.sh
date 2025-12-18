#!/bin/bash

# Script de préparation pour le premier push Git
# Vérifie la sécurité et prépare le repository

echo "═══════════════════════════════════════════════════════"
echo "🚀 Préparation du Push Git Sécurisé"
echo "═══════════════════════════════════════════════════════"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0

# Fonction pour afficher une étape
step() {
  echo -e "${BLUE}▶ $1${NC}"
}

# Fonction pour afficher un succès
success() {
  echo -e "${GREEN}✅ $1${NC}"
}

# Fonction pour afficher un warning
warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

# Fonction pour afficher une erreur
error() {
  echo -e "${RED}❌ $1${NC}"
  ((ERRORS++))
}

echo ""
step "Étape 1/7 : Vérification de l'environnement Git"
echo ""

# Vérifier que nous sommes dans un repo Git
if [ ! -d .git ]; then
  error "Pas de dossier .git trouvé. Initialiser avec 'git init' d'abord."
  exit 1
fi
success "Repository Git détecté"

echo ""
step "Étape 2/7 : Vérification du hook pre-commit"
echo ""

# Vérifier que le hook existe et est exécutable
if [ -f .git/hooks/pre-commit ]; then
  if [ -x .git/hooks/pre-commit ]; then
    success "Hook pre-commit installé et exécutable"
  else
    warning "Hook pre-commit existe mais n'est pas exécutable"
    chmod +x .git/hooks/pre-commit
    success "Hook rendu exécutable"
  fi
else
  error "Hook pre-commit manquant ! Créez-le d'abord."
fi

echo ""
step "Étape 3/7 : Vérification des fichiers sensibles"
echo ""

# Vérifier que .env n'est pas tracké
if git ls-files | grep -q "\.env$"; then
  error "Fichier .env détecté dans le repository !"
  echo "   Exécutez : git rm --cached backend/.env"
else
  success "Aucun fichier .env tracké"
fi

# Vérifier que .env.example existe
if [ -f backend/.env.example ]; then
  success "backend/.env.example présent"
else
  warning "backend/.env.example manquant"
fi

# Vérifier que node_modules n'est pas tracké
if git ls-files | grep -q "node_modules/"; then
  error "node_modules/ est tracké dans Git !"
  echo "   Exécutez : git rm -r --cached node_modules"
else
  success "node_modules/ non tracké"
fi

# Vérifier que les .db ne sont pas trackés
if git ls-files | grep -q "\.db$"; then
  error "Fichiers .db trackés dans Git !"
  echo "   Exécutez : git rm --cached *.db"
else
  success "Aucun fichier .db tracké"
fi

echo ""
step "Étape 4/7 : Vérification du .gitignore"
echo ""

# Vérifier que .env est dans .gitignore
if grep -q "^\.env$" .gitignore; then
  success ".env présent dans .gitignore"
else
  error ".env absent du .gitignore"
fi

# Vérifier que node_modules est dans .gitignore
if grep -q "node_modules" .gitignore; then
  success "node_modules présent dans .gitignore"
else
  error "node_modules absent du .gitignore"
fi

echo ""
step "Étape 5/7 : Vérification des secrets dans le code"
echo ""

# Rechercher des secrets potentiels
echo "   Recherche de secrets dans les fichiers staged..."
SECRETS=$(git diff --cached | grep -iE "password\s*=\s*['\"][^'\"]{5,}|api_key\s*=|secret\s*=\s*['\"][^'\"]{5,}" | grep -v "CHANGE_ME\|CHANGE_THIS\|example" || true)

if [ ! -z "$SECRETS" ]; then
  error "Secrets potentiels détectés :"
  echo "$SECRETS"
else
  success "Aucun secret évident détecté"
fi

echo ""
step "Étape 6/7 : Statistiques du repository"
echo ""

echo "   Fichiers trackés : $(git ls-files | wc -l)"
echo "   Fichiers modifiés : $(git status --short | wc -l)"
echo "   Taille du .git : $(du -sh .git | cut -f1)"

echo ""
step "Étape 7/7 : Test du hook pre-commit"
echo ""

# Tester le hook s'il y a des changements staged
if git diff --cached --quiet; then
  warning "Aucun fichier en staging pour tester le hook"
else
  echo "   Exécution du hook pre-commit..."
  if .git/hooks/pre-commit; then
    success "Hook pre-commit passé avec succès"
  else
    error "Hook pre-commit a échoué"
  fi
fi

echo ""
echo "═══════════════════════════════════════════════════════"

if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✅ PRÊT POUR LE PUSH !${NC}"
  echo ""
  echo "Prochaines étapes :"
  echo ""
  echo "  1. Ajouter les fichiers :"
  echo "     git add ."
  echo ""
  echo "  2. Faire un commit :"
  echo "     git commit -m \"📝 docs: Configuration initiale\""
  echo ""
  echo "  3. Configurer la remote (si nécessaire) :"
  echo "     git remote add origin https://github.com/USERNAME/REPO.git"
  echo ""
  echo "  4. Push :"
  echo "     git push -u origin main"
  echo ""
else
  echo -e "${RED}❌ $ERRORS ERREUR(S) DÉTECTÉE(S)${NC}"
  echo ""
  echo "Corrigez les erreurs avant de continuer."
  echo "Consultez COMMANDES_GIT.md pour plus d'aide."
  echo ""
  exit 1
fi

echo "═══════════════════════════════════════════════════════"
