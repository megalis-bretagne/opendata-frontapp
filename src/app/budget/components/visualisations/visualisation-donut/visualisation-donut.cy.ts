import { exemple_donnees_budgetaires, exemple_infos_pdc } from "cypress/fixtures/budgets-testdata"
import { BudgetTestBedModule } from "cypress/fixtures/testbed-modules"
import { BudgetModule } from "src/app/budget/budget.module"
import { VisualisationDonut } from "./visualisation-donut"

const id_a_nomenclature_function = '#command_nomenclatures_par_fonctions'
const id_a_nomenclature_nature = '#command_nomenclatures_par_fonctions'
describe('BudgetPrincipalGrapheComponent', () => {

    let donnees_budgetaires = exemple_donnees_budgetaires()
    let infos_pdc = exemple_infos_pdc()

    describe(
        'Pour des données budgetaires données',
        () => {
            describe('Et des informations de plan de compte avec une nomenclature par fonction et nature', () => {

                it('les boutons pour passer entre la nomenclature par fonction / nature sont tous deux fonctionnels', () => {

                    mount_budget_principal_graphe_component_with_data(donnees_budgetaires, infos_pdc)

                    cy.get(id_a_nomenclature_function).should('exist')
                    cy.get(id_a_nomenclature_nature).should('exist')
                })
            });

            describe('Et des informations de plan de compte avec une nomenclature par nature uniquement', () => {

                let infos_pdc_without_nomenclature_fonctions = exemple_infos_pdc()
                infos_pdc_without_nomenclature_fonctions.references_fonctionnelles = {}

                it('les boutons pour passer entre la nomenclature par fonction/nature sont absents', () => {

                    mount_budget_principal_graphe_component_with_data(donnees_budgetaires, infos_pdc_without_nomenclature_fonctions)

                    cy.get(id_a_nomenclature_function).should('not.exist')
                    cy.get(id_a_nomenclature_nature).should('not.exist')
                })
            });
        }
    )

    describe(
        'Pour une dimension en 1920x1080',
        { viewportHeight: 1080, viewportWidth: 1920 },
        () => {
            Cypress.config()
            it('mounts', () => mount_budget_principal_graphe_component_with_data(donnees_budgetaires, infos_pdc))
        }
    )

    // describe(
    //     'Pour une dimension de macbook-15',
    //     {  viewportHeight: 1440, viewportWidth: 900 },
    //     () => {
    //         Cypress.config()
    //         it('mounts', () => mount_budget_principal_graphe_component_with_data(donnees_budgetaires, infos_pdc))
    //     }
    // )
})

function mount_budget_principal_graphe_component_with_data(donnees_budgetaires, infos_pdc) {
    cy.mount(VisualisationDonut, {
        imports: [
            BudgetTestBedModule,
            BudgetModule,
        ],
        componentProperties: {
            rd: 'depense',
            donneesBudget: donnees_budgetaires,
            informationPlanDeComptes: infos_pdc,
        }
    })
}