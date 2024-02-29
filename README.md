# 🎮 GamePixel - Visualisation des données de l'histoire des jeux vidéo

## ✍️ Contexte

Les données utilisées dans ce projet proviennent de [Kaggle](https://www.kaggle.com), une plateforme de data science. Elles ont été mises à disposition par Simon Garanin. Les données ont été extraites à partir du site web [backloggd.com](https://backloggd.com). Les données sont récentes puiqu'elles datent du 02/10/2023.

## 📖 Description

Les données sont structurées dans un fichier CSV. Elles contiennent 14 colonnes et 101716 lignes.

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

Le but de ce projet est d'explorer l'histoire des jeux vidéo. Découvrir les tendances, les genres les plus populaires en remontant dans le temps. Nous allons mettre en avant un jeu par avancée technologique majeure tout en présentant l'état du marché des jeux vidéo à cette époque afin de pouvoir comparer les évolutions et les tendances du marché des jeux vidéo.

## 📚 Références

- Pour réaliser ce projet, nous avons utilisé les données provenant de [Kaggle](https://www.kaggle.com/datasets/gsimonx37/backloggd)
- Ces données ont également été utilisées à des fins de statistiques sur le répertoire [GitHub](https://github.com/GSimonX37/Backloggd)
