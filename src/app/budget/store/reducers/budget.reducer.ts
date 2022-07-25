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
        case BudgetActionType.LoadSuccess:
            let lignes = action.lignes;
            return {
                ...state,
                error: false,
                loading: false,
                lignes: lignes,
            }
        case BudgetActionType.LoadFailure:
            return {
                ...state,
                error: true,
                loading: false,
                lignes: [],
            }
        default:
            return state;
    }
}