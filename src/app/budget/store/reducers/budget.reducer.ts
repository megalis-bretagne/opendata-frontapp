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
        case BudgetActionType.AlreadyLoaded:
            return {
                ...state,
                loading: false,
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
        case BudgetActionType.LoadingDisponibles:
            return {
                ...state,
                loading: true,
            }
        case BudgetActionType.LoadDisponiblesAlreadyLoaded:
            return {
                ...state,
                loading: false,
            }
        case BudgetActionType.LoadDisponiblesSuccess:
            let disponibles = action.disponibles
            return {
                ...state,
                loading: false,
                error: false,
                donneesBudgetairesDisponibles: [...state.donneesBudgetairesDisponibles, disponibles],
            }
        case BudgetActionType.LoadDisponiblesFailure:
            return {
                ...state,
                loading: false,
                error: true,
            }
        default:
            return state;
    }
}