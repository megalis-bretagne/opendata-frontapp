import { exemple_donnees_budgetaires, exemple_infos_pdc } from "cypress/fixtures/budgets-testdata"
import { BudgetTestBedModule } from "cypress/fixtures/testbed-modules"
import { BudgetModule } from "src/app/budget/budget.module"
import { BudgetPrincipalGrapheComponent } from "./budget-principal-graphe.component"

describe('BudgetPrincipalGrapheComponent', () => {

    let donnees_budgetaires = exemple_donnees_budgetaires()
    let infos_pdc = exemple_infos_pdc()

    it('mounts', () => {
        cy.mount(BudgetPrincipalGrapheComponent, {
            imports: [
                BudgetTestBedModule,
                BudgetModule,
            ],
            componentProperties: {
                rd: 'depense',
                donneesBudget: donnees_budgetaires,
                informationPlanDeCompte: infos_pdc,
            }
        })
    })
})