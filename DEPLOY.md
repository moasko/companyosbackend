# Guide de déploiement sur Dockploy

## Prérequis

- Docker et Docker Compose installés
- Compte Dockploy configuré
- Variables d'environnement configurées

## Préparation pour le déploiement

### 1. Configuration des variables d'environnement

Créez un fichier `.env` basé sur `.env.example` :

```bash
cp .env.example .env
```

Configurez vos variables d'environnement :
```
DATABASE_URL="votre-url-postgresql"
JWT_SECRET="votre-secret-jwt-sécurisé"
PORT=8000
GEMINI_API_KEY="votre-api-key-gemini"
```

### 2. Build local du Docker

Pour tester le build Docker localement :

```bash
docker build -t companyos-backend:latest .
```

### 3. Test avec Docker Compose

Pour tester l'application avec une base de données PostgreSQL :

```bash
docker-compose up -d
```

Pour arrêter :
```bash
docker-compose down
```

### 4. Développement avec hot reload

Pour développer avec hot reload :

```bash
docker-compose -f docker-compose.dev.yml up
```

## Déploiement sur Dockploy

### Via interface Dockploy

1. Connectez-vous à Dockploy
2. Créez un nouveau projet
3. Connectez votre repository GitHub
4. Configurez le dockerfile : `Dockerfile`
5. Configurez le port : `8000`
6. Ajoutez les variables d'environnement dans les secrets Dockploy
7. Configurez le health check : `GET /health`

### Via CLI Dockploy

```bash
dockploy deploy --dockerfile Dockerfile --port 8000
```

## Étapes de build et déploiement

1. **Build multi-stage** : Construit l'application NestJS en mode production
2. **Prisma Client** : Génère automatiquement le client Prisma
3. **Optimisation** : Utilise une image runtime réduite (Alpine)
4. **Health Check** : Vérifie la santé de l'application toutes les 30 secondes

## Fichiers importants

- `Dockerfile` : Image de production optimisée
- `Dockerfile.dev` : Image de développement avec hot reload
- `.dockerignore` : Optimise la taille du build
- `docker-compose.yml` : Configuration de production locale
- `docker-compose.dev.yml` : Configuration de développement
- `.dockploy.json` : Configuration Dockploy

## Migrations et Seed

Avant le déploiement :

```bash
# Générer le client Prisma
npm run prisma:generate

# Exécuter les migrations
npm run prisma:push

# (Optionnel) Seed la base de données
npm run seed
```

## Dépannage

### Les migrations ne s'exécutent pas

Assurez-vous que `DATABASE_URL` est correctement configurée et que le fichier `prisma/schema.prisma` est copié dans l'image Docker.

### Problèmes de connexion à la base de données

Vérifiez que :
- La chaîne `DATABASE_URL` est valide
- Les pare-feu permettent la connexion
- La base de données est accessible depuis le conteneur

### Application ne démarre pas

Vérifiez les logs :
```bash
docker logs companyos-backend
```

## Performance et optimisations

- Multi-stage build pour réduire la taille de l'image
- Utilisation de Node Alpine pour une image minimale
- Separation des dépendances de dev et production
- Health checks pour la disponibilité

## Sécurité

- Ne commettez pas les fichiers `.env` en production
- Utilisez les secrets de Dockploy pour les variables sensibles
- Utilisez HTTPS en production
- Mettez à jour les images de base régulièrement
