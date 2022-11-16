import { InformationsPdcAction, InformationsPdcActionType } from "../actions/informations-pdc.actions";
import { copy_and_insert, LoadingState } from "../states/call-states";
import { informationsPdcAdapter, InformationsPdcState, initialInformationsPdcState, toStrInformationsPdcId } from "../states/informations-pdc.state";

export function informationsPdcReducer(
    state = initialInformationsPdcState,
    action: InformationsPdcAction,
): InformationsPdcState {

    switch (action.type) {
        case InformationsPdcActionType.Noop:
            return { ...state }

        case InformationsPdcActionType.Init:
            {
                return {
                    ...state,
                }
            }

        case InformationsPdcActionType.Loading:
            {
                let id = toStrInformationsPdcId(action)
                let callStates = copy_and_insert(state.callStates, id, LoadingState.LOADING)
                return {
                    ...state,
                    callStates: callStates,
                }
            }
        case InformationsPdcActionType.LoadSuccess:
            {
                let id = toStrInformationsPdcId(action)
                let callStates = copy_and_insert(state.callStates, id, LoadingState.LOADED)
                let pdc = action.infos_pdc
                let _state = informationsPdcAdapter.addOne(pdc, state)
                return {
                    ..._state,
                    callStates: callStates,
                }
            }
        case InformationsPdcActionType.LoadFailure:
            {
                let id = toStrInformationsPdcId(action)
                let err_msg = (!action.err) ? 'Une erreur inconnue est survenue' : action.err
                let callStates = copy_and_insert(state.callStates, id, { errorMsg: err_msg })
                return {
                    ...state,
                    callStates: callStates,
                }
            }
        default:
            return state
    }
}
