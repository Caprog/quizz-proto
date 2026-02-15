import { shuffle } from "../utils.shared.js"

const questions = [
  {
    "question": "Quelle est la règle d'or de David Mekersa pour les débutants ?",
    "options": [
      { "text": "Apprendre le C++ pendant 2 ans avant de coder", "value": "a", "isCorrect": false },
      { "text": "Pratiquer le 'Learn by doing' (apprendre en faisant)", "value": "b", "isCorrect": true },
      { "text": "Utiliser Unreal Engine dès le premier jour", "value": "c", "isCorrect": false },
      { "text": "Lire tous les livres théoriques sur le game design", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Quel langage est souvent recommandé chez Gamecodeur pour débuter ?",
    "options": [
      { "text": "Python", "value": "a", "isCorrect": false },
      { "text": "Java", "value": "b", "isCorrect": false },
      { "text": "Lua", "value": "c", "isCorrect": true },
      { "text": "Assembly", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Quel framework est central dans les formations de Gamecodeur ?",
    "options": [
      { "text": "LÖVE (Love2D)", "value": "a", "isCorrect": true },
      { "text": "React", "value": "b", "isCorrect": false },
      { "text": "Django", "value": "c", "isCorrect": false },
      { "text": "Flutter", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Pourquoi David Mekersa conseille-t-il de recoder des classiques (PONG, Breakout) ?",
    "options": [
      { "text": "Pour les revendre sur Steam", "value": "a", "isCorrect": false },
      { "text": "Parce qu'ils sont protégés par le droit d'auteur", "value": "b", "isCorrect": false },
      { "text": "Pour comprendre les bases fondamentales du code de jeu", "value": "c", "isCorrect": true },
      { "text": "Pour gagner des concours de graphisme", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Quel est l'objectif principal d'un 'Atelier' chez Gamecodeur ?",
    "options": [
      { "text": "Obtenir un diplôme d'État", "value": "a", "isCorrect": false },
      { "text": "Finir un prototype jouable en peu de temps", "value": "b", "isCorrect": true },
      { "text": "Apprendre à utiliser Photoshop", "value": "c", "isCorrect": false },
      { "text": "Devenir expert en marketing", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Que signifie le terme 'Coder avec les pieds' selon David ?",
    "options": [
      { "text": "Écrire du code sale mais fonctionnel pour avancer", "value": "a", "isCorrect": true },
      { "text": "Utiliser un clavier spécial pour les pieds", "value": "b", "isCorrect": false },
      { "text": "Faire des erreurs volontaires", "value": "c", "isCorrect": false },
      { "text": "Ne pas utiliser de fonctions", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Quelle est l'importance des mathématiques dans le développement de jeux selon lui ?",
    "options": [
      { "text": "Il faut être un génie en algèbre", "value": "a", "isCorrect": false },
      { "text": "Elles sont inutiles avec les moteurs modernes", "value": "b", "isCorrect": false },
      { "text": "Il faut maîtriser les bases (vecteurs, trigonométrie) pour être libre", "value": "c", "isCorrect": true },
      { "text": "Seules les additions suffisent", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Quel est le 'Mindset' de l'Indie Gamer Dev ?",
    "options": [
      { "text": "Vouloir créer le prochain GTA seul", "value": "a", "isCorrect": false },
      { "text": "Finir ses projets et rester simple", "value": "b", "isCorrect": true },
      { "text": "Passer 10 ans sur le même moteur de jeu", "value": "c", "isCorrect": false },
      { "text": "Attendre d'avoir un investisseur", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Dans un jeu 2D, que représente la boucle de jeu (Game Loop) ?",
    "options": [
      { "text": "Un menu circulaire", "value": "a", "isCorrect": false },
      { "text": "La répétition de l'Update et du Draw", "value": "b", "isCorrect": true },
      { "text": "Le générique de fin", "value": "c", "isCorrect": false },
      { "text": "Le système de sauvegarde", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Quel outil David utilise-t-il souvent pour le pixel art ?",
    "options": [
      { "text": "Maya 3D", "value": "a", "isCorrect": false },
      { "text": "Aseprite ou Piskel", "value": "b", "isCorrect": true },
      { "text": "AutoCAD", "value": "c", "isCorrect": false },
      { "text": "Illustrator", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Qu'est-ce que le 'Prototype' ?",
    "options": [
      { "text": "La version finale vendue", "value": "a", "isCorrect": false },
      { "text": "Un test de gameplay sans graphismes finaux", "value": "b", "isCorrect": true },
      { "text": "Le manuel d'utilisation", "value": "c", "isCorrect": false },
      { "text": "Une cinématique", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Selon Gamecodeur, pourquoi faire des Game Jams ?",
    "options": [
      { "text": "Pour gagner de l'argent", "value": "a", "isCorrect": false },
      { "text": "Pour apprendre à gérer le stress et finir un jeu", "value": "b", "isCorrect": true },
      { "text": "Pour trouver un employeur chez Ubisoft", "value": "c", "isCorrect": false },
      { "text": "Pour ne pas dormir", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Quelle est la vision de David sur les moteurs 'No-Code' ?",
    "options": [
      { "text": "C'est l'avenir absolu", "value": "a", "isCorrect": false },
      { "text": "C'est bien pour débuter, mais le code offre la vraie liberté", "value": "b", "isCorrect": true },
      { "text": "Il faut les interdire", "value": "c", "isCorrect": false },
      { "text": "C'est réservé aux professionnels", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "En programmation de jeux, qu'est-ce qu'un 'Sprite' ?",
    "options": [
      { "text": "Une boisson gazeuse", "value": "a", "isCorrect": false },
      { "text": "Une image 2D affichée à l'écran", "value": "b", "isCorrect": true },
      { "text": "Une variable de type texte", "value": "c", "isCorrect": false },
      { "text": "Un bug moteur", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Comment David Mekersa définit-il le 'Game Programming' ?",
    "options": [
      { "text": "De la magie noire", "value": "a", "isCorrect": false },
      { "text": "Manipuler des données pour modifier l'affichage", "value": "b", "isCorrect": true },
      { "text": "Écrire de la poésie", "value": "c", "isCorrect": false },
      { "text": "Utiliser uniquement Unity", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Quel est l'avantage de Lua ?",
    "options": [
      { "text": "Il est extrêmement complexe", "value": "a", "isCorrect": false },
      { "text": "Sa syntaxe est légère et proche du langage humain", "value": "b", "isCorrect": true },
      { "text": "Il appartient à Microsoft", "value": "c", "isCorrect": false },
      { "text": "Il ne fonctionne que sur Windows", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Qu'est-ce qu'une 'Collision AABB' ?",
    "options": [
      { "text": "Une collision entre deux boîtes alignées sur les axes", "value": "a", "isCorrect": true },
      { "text": "Un type de voiture", "value": "b", "isCorrect": false },
      { "text": "Un algorithme de tri", "value": "c", "isCorrect": false },
      { "text": "Une erreur de mémoire", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Quel conseil David donne-t-il concernant les assets graphiques au début ?",
    "options": [
      { "text": "Tout dessiner soi-même pendant des mois", "value": "a", "isCorrect": false },
      { "text": "Utiliser des carrés de couleur (Placeholders)", "value": "b", "isCorrect": true },
      { "text": "Acheter des modèles 3D coûteux", "value": "c", "isCorrect": false },
      { "text": "Engager un artiste immédiatement", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Qu'est-ce que le 'Delta Time' ?",
    "options": [
      { "text": "Le temps écoulé entre deux images (frames)", "value": "a", "isCorrect": true },
      { "text": "Un nouveau jeu de stratégie", "value": "b", "isCorrect": false },
      { "text": "La vitesse de connexion internet", "value": "c", "isCorrect": false },
      { "text": "Une variable pour le score", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Pourquoi David enseigne-t-il la création d'un moteur de jeu de A à Z ?",
    "options": [
      { "text": "Pour concurrencer Unreal Engine", "value": "a", "isCorrect": false },
      { "text": "Pour comprendre la logique interne et ne plus avoir peur", "value": "b", "isCorrect": true },
      { "text": "Parce que c'est la seule façon de vendre un jeu", "value": "c", "isCorrect": false },
      { "text": "Pour s'amuser avec les fichiers système", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Quelle est la structure de base d'un script Lua dans Love2D ?",
    "options": [
      { "text": "load, update, draw", "value": "a", "isCorrect": true },
      { "text": "start, loop, end", "value": "b", "isCorrect": false },
      { "text": "input, output, process", "value": "c", "isCorrect": false },
      { "text": "create, destroy, paint", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Que signifie 'Refactoring' dans le contexte de Gamecodeur ?",
    "options": [
      { "text": "Supprimer tout le code", "value": "a", "isCorrect": false },
      { "text": "Améliorer la structure du code sans changer le comportement", "value": "b", "isCorrect": true },
      { "text": "Ajouter des nouvelles fonctionnalités", "value": "c", "isCorrect": false },
      { "text": "Changer de langage de programmation", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Quelle est la philosophie de David sur l'échec ?",
    "options": [
      { "text": "C'est une honte", "value": "a", "isCorrect": false },
      { "text": "C'est une étape nécessaire pour apprendre", "value": "b", "isCorrect": true },
      { "text": "Il faut l'éviter à tout prix", "value": "c", "isCorrect": false },
      { "text": "Il ne faut jamais en parler", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Qu'est-ce qu'un 'State Machine' (Machine à états) ?",
    "options": [
      { "text": "Un ordinateur puissant", "value": "a", "isCorrect": false },
      { "text": "Un système pour gérer les comportements (Menu, Jeu, Game Over)", "value": "b", "isCorrect": true },
      { "text": "Une console de jeux ancienne", "value": "c", "isCorrect": false },
      { "text": "Un type de base de données", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Quel est le format audio recommandé pour les effets sonores rétro ?",
    "options": [
      { "text": "WAV ou OGG", "value": "a", "isCorrect": true },
      { "text": "MP3 uniquement", "value": "b", "isCorrect": false },
      { "text": "Vinyl", "value": "c", "isCorrect": false },
      { "text": "FLAC haute définition", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Pourquoi David préfère-t-il souvent la 2D à la 3D pour les indés ?",
    "options": [
      { "text": "La 3D est interdite par Gamecodeur", "value": "a", "isCorrect": false },
      { "text": "La 2D permet de se concentrer sur le gameplay et de finir plus vite", "value": "b", "isCorrect": true },
      { "text": "Les écrans ne gèrent plus la 3D", "value": "c", "isCorrect": false },
      { "text": "Parce que David ne sait pas compter en 3D", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Qu'est-ce que le 'Z-Order' ?",
    "options": [
      { "text": "L'ordre de priorité des ennemis", "value": "a", "isCorrect": false },
      { "text": "L'ordre d'affichage des sprites (profondeur)", "value": "b", "isCorrect": true },
      { "text": "La vitesse maximale d'un personnage", "value": "c", "isCorrect": false },
      { "text": "Un raccourci clavier", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Quelle est l'utilité d'un 'Tileset' ?",
    "options": [
      { "text": "C'est une collection de musiques", "value": "a", "isCorrect": false },
      { "text": "Une grille d'images pour construire des niveaux", "value": "b", "isCorrect": true },
      { "text": "Un réglage de difficulté", "value": "c", "isCorrect": false },
      { "text": "Une liste de joueurs", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Que signifie 'Indie' ?",
    "options": [
      { "text": "Industriel", "value": "a", "isCorrect": false },
      { "text": "Indépendant", "value": "b", "isCorrect": true },
      { "text": "Indispensable", "value": "c", "isCorrect": false },
      { "text": "Individuel", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Comment David Mekersa appelle-t-il le fait de rester bloqué sur un détail ?",
    "options": [
      { "text": "La procrastination créative", "value": "a", "isCorrect": false },
      { "text": "Le piège de la perfection", "value": "b", "isCorrect": true },
      { "text": "Le codage intensif", "value": "c", "isCorrect": false },
      { "text": "L'optimisation prématurée", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Quel est le rôle de la fonction 'update(dt)' ?",
    "options": [
      { "text": "Dessiner les images", "value": "a", "isCorrect": false },
      { "text": "Mettre à jour la logique et les positions", "value": "b", "isCorrect": true },
      { "text": "Charger les sons", "value": "c", "isCorrect": false },
      { "text": "Fermer le programme", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Dans Lua, comment indexe-t-on généralement les tableaux (tables) ?",
    "options": [
      { "text": "À partir de 0", "value": "a", "isCorrect": false },
      { "text": "À partir de 1", "value": "b", "isCorrect": true },
      { "text": "Avec des lettres uniquement", "value": "c", "isCorrect": false },
      { "text": "On ne peut pas les indexer", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Qu'est-ce que 'SFXR' ?",
    "options": [
      { "text": "Un outil pour générer des sons 8-bit", "value": "a", "isCorrect": true },
      { "text": "Une carte graphique", "value": "b", "isCorrect": false },
      { "text": "Un moteur de rendu", "value": "c", "isCorrect": false },
      { "text": "Un format de fichier texte", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Que recommande David pour ne pas abandonner un projet ?",
    "options": [
      { "text": "Travailler 15h par jour", "value": "a", "isCorrect": false },
      { "text": "Réduire la portée (scope) du jeu", "value": "b", "isCorrect": true },
      { "text": "Commencer par un RPG multijoueur", "value": "c", "isCorrect": false },
      { "text": "Ne jamais montrer son code", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Qu'est-ce qu'une 'Variable Globale' selon les bonnes pratiques ?",
    "options": [
      { "text": "Une variable accessible partout (à utiliser avec parcimonie)", "value": "a", "isCorrect": true },
      { "text": "Une variable qui coûte de l'argent", "value": "b", "isCorrect": false },
      { "text": "Une variable qui ne change jamais", "value": "c", "isCorrect": false },
      { "text": "Une variable pour la météo mondiale", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Quel est le but du 'Game Design Document' (GDD) ?",
    "options": [
      { "text": "Remplir de la paperasse", "value": "a", "isCorrect": false },
      { "text": "Poser les idées et mécaniques sur papier avant de coder", "value": "b", "isCorrect": true },
      { "text": "Servir de contrat légal", "value": "c", "isCorrect": false },
      { "text": "Calculer les bénéfices", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Pourquoi David parle-t-il souvent de l'Amstrad CPC ou du Commodore 64 ?",
    "options": [
      { "text": "Parce qu'ils sont encore vendus à la Fnac", "value": "a", "isCorrect": false },
      { "text": "Pour illustrer la simplicité et les contraintes créatives", "value": "b", "isCorrect": true },
      { "text": "Parce qu'il n'aime pas le futur", "value": "c", "isCorrect": false },
      { "text": "Pour vendre des émulateurs", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Comment appelle-t-on le fait d'organiser ses objets par composants ?",
    "options": [
      { "text": "L'héritage complexe", "value": "a", "isCorrect": false },
      { "text": "ECS (Entity Component System)", "value": "b", "isCorrect": true },
      { "text": "Le tri sélectif", "value": "c", "isCorrect": false },
      { "text": "La programmation linéaire", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Quel est le conseil de David pour le marketing d'un jeu indé ?",
    "options": [
      { "text": "Attendre la sortie pour en parler", "value": "a", "isCorrect": false },
      { "text": "Partager son avancement régulièrement (Devlog)", "value": "b", "isCorrect": true },
      { "text": "Payer des publicités TV", "value": "c", "isCorrect": false },
      { "text": "Spammer les forums", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Qu'est-ce que le 'Juice' dans un jeu ?",
    "options": [
      { "text": "Le niveau d'énergie du joueur", "value": "a", "isCorrect": false },
      { "text": "Les petits effets (particules, sons) qui rendent le jeu satisfaisant", "value": "b", "isCorrect": true },
      { "text": "Une boisson énergisante pour développeur", "value": "c", "isCorrect": false },
      { "text": "Le prix du jeu", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Comment David Mekersa aborde-t-il l'apprentissage de la programmation ?",
    "options": [
      { "text": "Comme une corvée", "value": "a", "isCorrect": false },
      { "text": "Comme un super-pouvoir créatif", "value": "b", "isCorrect": true },
      { "text": "Comme un examen de mathématiques", "value": "c", "isCorrect": false },
      { "text": "Comme une perte de temps", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Quel est l'usage principal de la fonction 'draw()' ?",
    "options": [
      { "text": "Calculer la physique", "value": "a", "isCorrect": false },
      { "text": "Afficher les éléments visuels", "value": "b", "isCorrect": true },
      { "text": "Sauvegarder la partie", "value": "c", "isCorrect": false },
      { "text": "Lire les entrées clavier", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Qu'est-ce qu'une 'Hitbox' ?",
    "options": [
      { "text": "Une boîte de conserve", "value": "a", "isCorrect": false },
      { "text": "La zone invisible qui gère les collisions", "value": "b", "isCorrect": true },
      { "text": "Le meilleur score", "value": "c", "isCorrect": false },
      { "text": "Un bouton sur la manette", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Quelle est l'utilité du 'Random' (aléatoire) ?",
    "options": [
      { "text": "Faire planter le jeu", "value": "a", "isCorrect": false },
      { "text": "Créer de la variété et de l'imprévisibilité", "value": "b", "isCorrect": true },
      { "text": "Rendre le code illisible", "value": "c", "isCorrect": false },
      { "text": "Économiser de la mémoire", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Selon David, quel est le meilleur outil pour gérer son code ?",
    "options": [
      { "text": "Une clé USB", "value": "a", "isCorrect": false },
      { "text": "Git (et des plateformes comme GitHub)", "value": "b", "isCorrect": true },
      { "text": "Le bloc-notes Windows", "value": "c", "isCorrect": false },
      { "text": "L'imprimer sur papier", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Que signifie 'Don't Repeat Yourself' (DRY) ?",
    "options": [
      { "text": "Ne pas boire d'eau", "value": "a", "isCorrect": false },
      { "text": "Éviter la duplication de code en utilisant des fonctions", "value": "b", "isCorrect": true },
      { "text": "Ne pas parler aux autres", "value": "c", "isCorrect": false },
      { "text": "Écrire du code très court", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Qu'est-ce que l'interpolation linéaire (Lerp) ?",
    "options": [
      { "text": "Une transition fluide entre deux valeurs", "value": "a", "isCorrect": true },
      { "text": "Un mode de difficulté", "value": "b", "isCorrect": false },
      { "text": "Une erreur de compilation", "value": "c", "isCorrect": false },
      { "text": "Un type de sprite", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Pourquoi David déconseille-t-il de commencer par un MMORPG ?",
    "options": [
      { "text": "C'est trop facile", "value": "a", "isCorrect": false },
      { "text": "C'est techniquement trop complexe pour une seule personne", "value": "b", "isCorrect": true },
      { "text": "Les serveurs coûtent trop cher", "value": "c", "isCorrect": false },
      { "text": "Il n'aime pas les jeux en ligne", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Quelle est la 'communauté' de Gamecodeur ?",
    "options": [
      { "text": "Des hackers russes", "value": "a", "isCorrect": false },
      { "text": "Un groupe d'entraide bienveillant entre passionnés", "value": "b", "isCorrect": true },
      { "text": "Une secte secrète", "value": "c", "isCorrect": false },
      { "text": "Des joueurs professionnels", "value": "d", "isCorrect": false }
    ]
  },
  {
    "question": "Quel est le dernier mot de David dans ses vidéos ?",
    "options": [
      { "text": "Ciao !", "value": "a", "isCorrect": false },
      { "text": "Bon code !", "value": "b", "isCorrect": true },
      { "text": "Achetez ma formation !", "value": "c", "isCorrect": false },
      { "text": "Fin.", "value": "d", "isCorrect": false }
    ]
  }
]


export const QuestionService = {
  getRandomQuestions: (count = 3) => {
    return shuffle(questions)
      .slice(0, count)
      .map(({ question, options }) => ({
        question,
        options: shuffle(options)
      }))
  }
}