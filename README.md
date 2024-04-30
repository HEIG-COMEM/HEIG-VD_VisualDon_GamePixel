# 🎮 GamePixel - Visualisation des données de l'histoire graphique des jeux vidéo

## Table des matières

-   [✍️ Contexte](#✍️-contexte)
-   [📖 Description](#📖-description)
    -   [🚀 Application dynamique](#🚀-application-dynamique)
-   [🎯 But](#🎯-but)
-   [🎨 Wireframes](#🎨-wireframes)
-   [🧑‍💻 Site web](#🧑‍💻-site-web)
-   [📚 Références](#📚-références)

## ✍️ Contexte

Les données utilisées dans ce projet proviennent de [Kaggle](https://www.kaggle.com), une plateforme de data science. Elles ont été mises à disposition par Simon Garanin. Les données ont été extraites à partir du site web [backloggd.com](https://backloggd.com). Ces données, datant du 02/10/2023, sont complétées par des informations supplémentaires provenant de diverses sources, consolidées pour créer notre propre dataset personnalisé.

## 📖 Description

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

### 🚀 Application dynamique

Afin de permettre une évolutivité de l'application, nous avons décidé de créer une application dynamique. Cela signifie que l'application est capable de s'adapter à de nouvelles données. Ainsi, si de nouvelles données sont ajoutées, l'application pourra les prendre en compte et les afficher.

Pour ce faire nous avons besoin de créer notre propore fichier de données qui contiendra les données a afficher. Ce fichier sera un fichier JSON qui contiendra les données suivantes:

```json
{
    "events": [
        {
            "name": "nom de l'événement",
            "date": "date de l'événement",
            "description": "description de l'événement",
            "games": [
                {
                    "name": "nom du jeu",
                    "date": "date de sortie du jeu",
                    "description": "description du jeu",
                    "poster": "lien vers l'image du jeu",
                    "rating": "note moyenne du jeu",
                    "plays": "nombre total de joueurs",
                    "genres": ["genre 1", "genre 2", "..."],
                    "platforms": ["plateforme 1", "plateforme 2", "..."]
                }
            ]
        }
    ]
}
```

## 🎯 But

Le but de ce projet est d'explorer l'histoire graphique des jeux vidéo. Découvrir les tendances, les genres les plus populaires en remontant dans le temps. Nous allons mettre en avant un jeu par avancée technologique graphique majeure tout en présentant l'état du marché des jeux vidéo à cette époque afin de pouvoir comparer les évolutions et les tendances du marché des jeux vidéo.

## 🎨 Wireframes

Pour visualiser les wireframes de notre application GamePixel, veuillez consulter le lien ci-dessous :

[Wireframes GamePixel](https://www.figma.com/file/axoVljvnAqJTVqeDaO9lGX/HEIG---VisualDon---GamePixel?type=design&node-id=0%3A1&mode=design&t=tP3qa7rEcix13GWp-1)

## 🧑‍💻 Site web

Afin de mettre en ligne notre application, nous avons utilisé le service de déploiement de site web [Netlify](https://www.netlify.com/). Vous pouvez accéder à notre application en cliquant sur le lien ci-dessous :

[GamePixel](https://gamepixel-visualdon.netlify.app/)

## 📚 Références

-   Pour réaliser ce projet, nous avons utilisé les données provenant de [Kaggle](https://www.kaggle.com/datasets/gsimonx37/backloggd)
-   Ces données ont également été utilisées à des fins de statistiques sur le répertoire [GitHub](https://github.com/GSimonX37/Backloggd)
