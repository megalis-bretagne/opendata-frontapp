# Changelog

Tous changements importants seront journalisés dans ce fichier.

Basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [unreleased]

### Ajouts

 - Feature publication des annexes ([issue](https://https://github.com/megalis-bretagne/opendata-marqueblanche/issues/3))

### Changés

 - Divers refactorings
   - Amélioration des flag de paramétrage d'organisation
   - Suppression de duplication de code
 - [BUDGETS] Documentation développeur pour le module budget


## [1.0.12] - 2023-01-24

### Changed

- [BUDGETS] N'affiche pas les décisions modificatives.
- [BUDGETS] Menu `Marqueblanche` devient `Réutilisation Actes`

### Added

- [BUDGETS] Menu `Réutilisation Budgets` activé.

## [1.0.11] - 2023-01-18

### Fixed

- [BUDGETS] Correction bug qui affichait le chargement si une erreur était survenue  lors du chargement des budgets
- [BUDGETS] Espace entre chaque encart de budget
- Selection du thème pour la MQ actes

## [1.0.10] - 2023-01-10

### Changed

- Chargement des plans de comptes suit la nouvelle API
- Chargement des documents dans la liste des publications (ouverture nouvel onglet)


## [1.0.8] - 2022-12-07

### Added 

- Réutilisation budgets: Ajout du choix des établissements pour le siren concerné.
- Réutilisation budgets: Ajout du graphe top 3 des dépenses.
- Réutilisation budgets: Export des visualisations en image.
- Réutilisation budgets: Meilleure UI pour les actions sur visualisation.
- Réutilisation budgets: Modale de prévisualisation pour les fragments iframe budget.
- Réutilisation budgets: Possibilité d'édition des titres pour les graphes.
- Paramètre `budgets.etapes_a_afficher` au sein de [./src/assets/settings.json](./src/assets/settings.json)

### Changed

- Couleur et wording du bouton publication.
- Réutilisation budgets: menu de navigation selon les ressources budgetaires disponibles.
- Logo france relance hors écrans de consultation / embarqués dans les iframes.
- Technique: protractor -> cypress
- Technique: mise à jour version angular
- Technique: fichiers `proxy.conf.json` et `settings.json` déplacés vers [sample-proxy.conf.json](./sample-proxy.conf.json) et [sample-settings.json](./src/assets/sample-settings.json)

### Fixed

- Réutilisation budgets: graphe principal réactif à la taille.
- Réutilisation budgets: meilleure gestion des écrans de chargement.
- Technique: CVE-2022-37603 loader-utils 2.0.4


## [1.0.7] - 2022-09-22

### Added

- Prise en acte sans tdt - [https://github.com/megalis-bretagne/opendata-extraction/issues/24](https://github.com/megalis-bretagne/opendata-extraction/issues/24)
- 1er graph marque blanche budget

### Changed

- Divers refactorings

### Fixed

- INTERFACE - Mise à jour des textes des différentes rubriques - [https://github.com/megalis-bretagne/opendata-frontapp/issues/6](https://github.com/megalis-bretagne/opendata-frontapp/issues/6)
