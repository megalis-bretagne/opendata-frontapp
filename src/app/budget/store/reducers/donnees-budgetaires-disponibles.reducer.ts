import { DonneesBudgetairesDisponiblesAction, DonneesBudgetairesDisponiblesActionType } from "../actions/donnees-budgetaires-disponibles.actions";
import { copy_and_insert, LoadingState } from "../states/call-states";
import { donneesBudgetairesDisponiblesAdapter, DonneesBudgetairesDisponiblesState, initialDonneesBudgetairesDisponiblesState } from "../states/donnees-budgetaires-disponibles.state";

export function donneesBudgetairesDisponiblesReducer(
    state = initialDonneesBudgetairesDisponiblesState,
    action: DonneesBudgetairesDisponiblesAction,
): DonneesBudgetairesDisponiblesState {

    switch (action.type) {
        case DonneesBudgetairesDisponiblesActionType.Noop:
            return { ...state }

        case DonneesBudgetairesDisponiblesActionType.Init:
            return { ...state, }

        case DonneesBudgetairesDisponiblesActionType.Loading:
            {
                let siren = action.siren
                let callStates = copy_and_insert(state.callStates, siren, LoadingState.LOADING)
                return {
                    ...state,
                    callStates: callStates
                }
            }

        case DonneesBudgetairesDisponiblesActionType.LoadSuccess:
            {
                let siren = action.siren
                let callStates = copy_and_insert(state.callStates, siren, LoadingState.LOADED)
                let disponibles = action.disponibles
                let _state = donneesBudgetairesDisponiblesAdapter.addOne(disponibles, state)
                return {
                    ..._state,
                    callStates: callStates,
                }
            }
        case DonneesBudgetairesDisponiblesActionType.LoadFailure:
            {
                let siren = action.siren
                let err_msg = (!action.error) ? 'Une erreur inconnue est survenue': action.error
                let callStates = copy_and_insert(state.callStates, siren, { errorMsg: err_msg })
                return {
                    ...state,
                    callStates: callStates,
                }
            }

        default:
            return state
    }

}