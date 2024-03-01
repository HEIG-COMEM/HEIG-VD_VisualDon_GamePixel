# 🎮 GamePixel - Visualisation des données de l'histoire graphique des jeux vidéo

## ✍️ Contexte

[TODO]: <Contexte : Directement les data exploitées plutôt que le sujet ?>

Les données utilisées dans ce projet proviennent de [Kaggle](https://www.kaggle.com), une plateforme de data science. Elles ont été mises à disposition par Simon Garanin. Les données ont été extraites à partir du site web [backloggd.com](https://backloggd.com). Ces données, datant du 02/10/2023, sont complétées par des informations supplémentaires provenant de diverses sources, consolidées pour créer notre propre dataset personnalisé.

## 📖 Description

[TODO]: <Seulement les colonnes qu'on exloite ?>
[TODO]: <Seulement un tableau complet avec le dataset personnalisé ?>

Les données sont structurées dans un fichier CSV. Elles contiennent 14 colonnes et 101'716 lignes.

Les colonnes sont les suivantes:

| Nom de la colonne | Description                                                               | Type de données |
| ----------------- | ------------------------------------------------------------------------- | --------------- |
| `name`            | nom du jeu vidéo                                                          | `String`        |
| `date`            | date de sortie du jeu vidéo                                               | `DateTime`      |
| `genres`          | une liste de genres de jeux                                               | `Array(String)` |
| `platforms`       | une liste des plateformes de jeux                                         | `Array(String)` |
| `developers`      | un groupe de développeurs                                                 | `Array(String)` |
| `rating`          | note moyenne du jeu vidéo                                                 | `Decimal`       |
| `votes`           | nombre d'évaluations des utilisateurs (nombre d'évaluations de 0,5 à 5,0) | `Array(String)` |
| `category`        | type de publication                                                       | `String`        |
| `reviews`         | le nombre d'avis laissés sur le jeu vidéo                                 | `Decimal`       |
| `plays`           | nombre total de joueurs                                                   | `Decimal`       |
| `playing`         | le nombre de joueurs actuels                                              | `Decimal`       |
| `backlog`         | nombre d'ajouts au carnet de commandes                                    | `Decimal`       |
| `wishlists`       | nombre d'ajouts à la liste de souhaits                                    | `Decimal`       |
| `description`     | description du jeu vidéo                                                  | `String`        |

## 🎯 But

[TODO]: <Vérifier que ce qui est dit là correspond à ce qu'on présentera>

Le but de ce projet est d'explorer l'histoire graphique des jeux vidéo. Découvrir les tendances, les genres les plus populaires en remontant dans le temps. Nous allons mettre en avant un jeu par avancée technologique graphique majeure tout en présentant l'état du marché des jeux vidéo à cette époque afin de pouvoir comparer les évolutions et les tendances du marché des jeux vidéo.

## 📚 Références

[TODO]: <Ajouter les ressources pour les data supplémentaires>

- Pour réaliser ce projet, nous avons utilisé les données provenant de [Kaggle](https://www.kaggle.com/datasets/gsimonx37/backloggd)
- Ces données ont également été utilisées à des fins de statistiques sur le répertoire [GitHub](https://github.com/GSimonX37/Backloggd)
