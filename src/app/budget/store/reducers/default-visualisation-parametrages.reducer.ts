import { DefaultVisualisationParametrageLocalisation } from "../../models/defaultvisualisation-parametrage";
import { DefaultVisualisationParametrageAction, DefaultVisualisationParametrageActionType } from "../actions/default-visualisation-parametrages.action";
import { copy_and_insert, LoadingState } from "../states/call-states";
import { defaultVisualisationParametrageAdapter, DefaultVisualisationParametrageState, initialDefaultVisualisationParametrageState, toDefaultVisualisationParametrageStringId } from "../states/default-visualisation-parametrages.state";

export function defaultVisualisationParametrageReducer(
    state = initialDefaultVisualisationParametrageState,
    action: DefaultVisualisationParametrageAction,
): DefaultVisualisationParametrageState {

    let partial_localisation: Partial<DefaultVisualisationParametrageLocalisation> = {
        annee: action.annee,
        siret: action.siret,
        etape: action.etape
    }
    let parent_str_id = toDefaultVisualisationParametrageStringId(partial_localisation)

    switch (action.type) {

        case DefaultVisualisationParametrageActionType.Noop:
            {
                return { ...state }
            }

        case DefaultVisualisationParametrageActionType.Init:
            return { ...state, }

        case DefaultVisualisationParametrageActionType.Loading:
            {
                let call_states = state.callStates
                call_states = copy_and_insert(call_states, parent_str_id, LoadingState.LOADING)
                for (const k in call_states) {

                    if (!k.startsWith(parent_str_id))
                        continue

                    call_states = copy_and_insert(call_states, k, LoadingState.LOADING)
                }

                return {
                    ...state,
                    callStates: call_states,
                }
            }

        case DefaultVisualisationParametrageActionType.LoadSuccess:
            {
                let call_states = state.callStates
                let parametrages = action.donnees
                let _state = defaultVisualisationParametrageAdapter.setMany(parametrages, state)
                call_states = copy_and_insert(call_states, parent_str_id, LoadingState.LOADED)
                for (const parametrage of parametrages) {
                    let _str_id = toDefaultVisualisationParametrageStringId(parametrage.localisation)
                    call_states = copy_and_insert(call_states, _str_id, LoadingState.LOADED)
                }
                return {
                    ..._state,
                    callStates: call_states
                }
            }

        case DefaultVisualisationParametrageActionType.LoadFailure:
            {
                let err_msg = (!action.err) ? 'Une erreur inconnue est survenue' : action.err
                let call_states = copy_and_insert(state.callStates, parent_str_id, { errorMsg: err_msg })
                return {
                    ...state,
                    callStates: call_states,
                }
            }

        case DefaultVisualisationParametrageActionType.Edit:
            {

                let str_id = toDefaultVisualisationParametrageStringId({...partial_localisation, graphe_id: action.graphe_id})
                let call_states = state.callStates

                call_states = copy_and_insert(call_states, str_id, LoadingState.LOADING)

                return { ...state, callStates: call_states }
            }

        case DefaultVisualisationParametrageActionType.EditSuccess:
            {

                let str_id = toDefaultVisualisationParametrageStringId({...partial_localisation, graphe_id: action.parametrage.localisation.graphe_id})
                let call_states = state.callStates
                call_states = copy_and_insert(call_states, str_id, LoadingState.LOADED)

                let _state = defaultVisualisationParametrageAdapter.setOne(action.parametrage, state)

                return { ..._state, callStates: call_states }
            }

        case DefaultVisualisationParametrageActionType.EditFailure:
            {

                let str_id = toDefaultVisualisationParametrageStringId({...partial_localisation, graphe_id: action.graphe_id})
                let call_states = state.callStates
                call_states = copy_and_insert(call_states, str_id, { errorMsg: "Erreur inconnue" })


                return { ...state, callStates: call_states }
            }

        default:
            return state
    }
}