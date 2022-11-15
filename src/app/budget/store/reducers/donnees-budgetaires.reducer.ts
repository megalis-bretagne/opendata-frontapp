import { DonneesBudgetairesAction, DonneesBudgetairesActionType } from "../actions/donnees-budgetaires.actions";
import { copy_and_insert, LoadingState } from "../states/call-states";
import { donneesBudgetairesAdapter, DonneesBudgetairesState, initialDonneesBudgetairesState, toDonneesBudgetairesStringId } from "../states/donnees-budgetaires.state";

export function donneesBudgetairesReducer(
    state = initialDonneesBudgetairesState,
    action: DonneesBudgetairesAction,
): DonneesBudgetairesState {

    let str_id = toDonneesBudgetairesStringId(action)

    switch(action.type) {

        case DonneesBudgetairesActionType.Noop: 
            return { ...state }

        case DonneesBudgetairesActionType.Init: 
        {
            return {
                ...state,
            }
        }

        case DonneesBudgetairesActionType.Loading: 
        {
            let call_states = copy_and_insert(state.callStates, str_id, LoadingState.LOADING)
            return {
                ...state,
                callStates: call_states,
            }
        }

        case DonneesBudgetairesActionType.LoadSuccess: 
        {
            let donnees = action.donnees
            let _state = donneesBudgetairesAdapter.addOne(donnees, state)
            let call_states = copy_and_insert(state.callStates, str_id, LoadingState.LOADED)
            return {
                ..._state,
                callStates: call_states
            }
        }

        case DonneesBudgetairesActionType.LoadFailure: 
        {
            let err_msg = (!action.err)? 'Une erreur inconnue est survenue': action.err
            let call_states = copy_and_insert(state.callStates, str_id, { errorMsg: err_msg })
            return {
                ...state,
                callStates: call_states,
            }
        }

        default:
            return state;
    }
}