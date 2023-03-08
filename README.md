# opendata frontapp

Ce projet est l'IHM permettant de:

- Contrôler la publication des actes passant via la stack opendata.
- Administrer la marque blanche des actes.
- Administrer la marque blanche budgets.

## Documentation développeur

### Environnement local

Certains fichier sont spécifiques à l'environnement local. Des exemples sont versionnés:

| Fichier d'exemple                                                      | Copier vers                                              |
| ---------------------------------------------------------------------- | -------------------------------------------------------- |
| [./src/assets/sample-settings.json](./src/assets/sample-settings.json) | [./src/assets/settings.json](./src/assets/settings.json) |
| [./sample-proxy.conf.json](./sample-proxy.conf.json)                   | [./proxy.conf.json](./proxy.conf.json)                   |

### Commandes utiles

#### Lister les commandes

```bash
npm run
```

*Exemple, démarrer l'application avec un environnement local*

```bash
npm run start
```

### Mettre à jour le projet

```bash
npx -p @angular/cli ng update
```

### Module marque blanche budgets

L'interface d'administration de la marque blanche budget est situé dans son module [budget](./src/app/budget/).

Voici les composants principaux du module:

#### [**Les visualisations**](./src/app/budget/components/visualisations/)

Contient les différentes visualisations disponibles de l'application.

Ce sont des composants qui utilisent le module [echarts](https://echarts.apache.org/en/index.html) pour proposer des manières de visualiser les données budgétaires.

Chaque composant de visualisation se conforme au [VisualisationComponent](./src/app/budget/components/visualisations/visualisation.component.ts).

A noter que le [GroupOfVisualisations](./src/app/budget/components/visualisations/group-of-visualisations/group-of-visualisations.component.ts) est un conteneur pour les visualisations.

#### [**budget-routing.module.ts**](./src/app/budget/budget-routing.module.ts)

Module de routage. Deux points d'entrée principaux:

 * [Paramétrage](#parametrage)
 * [Consultation](#consultation)

#### <a name="consultation"></a> [components/budget-consultation](./src/app/budget/components/budget-consultation/)

Point d'entrée vers les écrans de consultation de ma marque blanche budget. Ces pages ont pour finalité d'être intégrées via iframe dans une application distante.

#### <a name="parametrage"></a> [components/budget-parametrage](./src/app/budget/components/budget-parametrage/)

Écrans d'administration du module budget. Ces écrans permettent de définir des titres personnalisés pour les graphiques et de prévisualiser les graphes budget.

#### [**store**](./src/app/budget/store/)

Module pour gérer les états du module budgets. Voir [ngrx](https://ngrx.io/).

C'est ici que l'on trouvera les données budgétaires, les titres des graphiques etc.