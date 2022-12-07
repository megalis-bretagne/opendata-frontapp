import { map_donnees_budgetaires_disponibles_from_wire } from '../services/budget.service'
import { donnees_budgetaires_disponibles_annees, donnees_budgetaires_disponibles_etapes, donnees_budgetaires_disponibles_sirets } from "./donnees-budgetaires-disponibles";

import * as donnees_budgetaires_disponibles_example from './donnees_budgetaires_disponibles.example.json';
import { EtapeBudgetaire } from './etape-budgetaire';

/* XXX: Bien utiliser cette fonction qui clone le json en entrée */
function example_donnees_budgetaires_disponibles() {
    let stringified = JSON.stringify(donnees_budgetaires_disponibles_example)
    let parsed = JSON.parse(stringified)
    return parsed;
}

describe('pour un json ressource budgetaires disponibles', () => {
    const json = example_donnees_budgetaires_disponibles()

    describe("Lorsqu'on le map vers notre modèle", () => {

        const mapped = map_donnees_budgetaires_disponibles_from_wire(json)

        it('les étapes sont bel et bien parsées correctement', () => {

            let une_etape_administrative = mapped.ressources_disponibles['2020']['25351449100047'][0] 
            expect(une_etape_administrative).toEqual(EtapeBudgetaire.COMPTE_ADMINISTRATIF)

            let une_etape_decision_modif = mapped.ressources_disponibles['2021']['25351449100047'][1]
            expect(une_etape_decision_modif).toEqual(EtapeBudgetaire.DECISION_MODIFICATIVE)
        })
    })
})

describe('pour un modèle ressource budget disponible', () => {

    const example = map_donnees_budgetaires_disponibles_from_wire(example_donnees_budgetaires_disponibles())

    describe("lorsqu'on extrait les sirets", () => {

        let sirets = donnees_budgetaires_disponibles_sirets(example)
        it('on doit en trouver deux', () => {
            expect(sirets.length).toBe(2);
        });
    });

    describe("lorsqu'on extrait les sirets pour l'année 2020", () => {

        let sirets = donnees_budgetaires_disponibles_sirets(example, '2020')
        it('on doit en trouver un', () => {
            expect(sirets.length).toBe(1);
        });
    });


    describe("Lorsqu'on extrait les années", () => {

        let annees = donnees_budgetaires_disponibles_annees(example)
        it('On doit en trouver trois', () => {
            expect(annees.length).toBe(3);
        })
    });

    describe("Lorsqu'on extrait les étapes", () => {
        let etapes = donnees_budgetaires_disponibles_etapes(example);

        it('on devrait avoir toutes les étapes avec des données budgetaires disponibles', () => {

            let expected = [
                EtapeBudgetaire.COMPTE_ADMINISTRATIF, 
                EtapeBudgetaire.DECISION_MODIFICATIVE,
                EtapeBudgetaire.BUDGET_PRIMITIF,
            ]
            expect(etapes.sort()).toEqual(expected.sort())
        })
    });

    describe("Lorsqu'on extrait les étapes pour l'année 2020", () => {
        let etapes = donnees_budgetaires_disponibles_etapes(example, '2020');

        it('on devrait seulement avoir le compte administratif', () => {

            let expected = [EtapeBudgetaire.COMPTE_ADMINISTRATIF]
            expect(etapes.sort()).toEqual(expected.sort())
        })
    });

    describe("Lorsqu'on extrait les étapes pour l'année '2021' et le siret '25351449100054'", () => {

        let etapes = donnees_budgetaires_disponibles_etapes(example, '2021', '25351449100054');

        it('on devrait avoir le compte administratif et la décision modificative', () => {

            let expected = [EtapeBudgetaire.COMPTE_ADMINISTRATIF, EtapeBudgetaire.DECISION_MODIFICATIVE]
            expect(etapes.sort()).toEqual(expected.sort())
        })

    })
});
