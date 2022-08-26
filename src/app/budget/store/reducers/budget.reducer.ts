import { BudgetAction, BudgetActionType } from "../actions/budget.actions";
import { BudgetState, initialBudgetState } from "../states/budget.state";

export function budgetReducer(state = initialBudgetState, action: BudgetAction): BudgetState {
    switch (action.type) {
        case BudgetActionType.Loading:
            return {
                ...state,
                error: false,
                loading: true
            }
        case BudgetActionType.LoadSuccess: {
            let donnees = action.donnees;
            let infoPdc = action.informationPdc;
            return {
                ...state,
                error: false,
                loading: false,
                budgets: [...state.budgets, donnees],
                infoPlanDeComptes: [ ...state.infoPlanDeComptes, infoPdc]
            }
        }
        case BudgetActionType.LoadFailure:
            return {
                ...state,
                error: true,
                loading: false,
            }
        case BudgetActionType.LoadingAnneesDisponibles:
            return {
                ...state,
                loading: true,
            }
        case BudgetActionType.LoadAnneesDisponiblesSuccess:
            let annees = action.annees
            return {
                ...state,
                loading: false,
                error: false,
                anneesDisponibles: annees
            }
        case BudgetActionType.LoadAnneesDisponiblesFailure:
            return {
                ...state,
                loading: false,
                error: true,
            }
        default:
            return state;
    }
}