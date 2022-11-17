# Changelog

Tous changements importants seront journalisés dans ce fichier.

Basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added 

- Réutilisation budgets: Ajout du choix des établissements pour le siren concerné.
- Réutilisation budgets: Ajout du graphe top 3 des dépenses.

### Changed

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
