import {ParametrageAction, ParametrageActionType} from '../actions/parametrage.actions';
import {initialParametrageState, parametrageAdapter, ParametrageState} from '../states/parametrage.state';

export function parametrageReducer(state = initialParametrageState, action: ParametrageAction): ParametrageState {
  switch (action.type) {
    case ParametrageActionType.Loading: {
      return { ...state, loading: true };
    }
    case ParametrageActionType.LoadSuccess: {
      return parametrageAdapter.setOne(action.parametrage, {
        ...state,
        error: false,
        loading: false
      });
    }

    case ParametrageActionType.Update: {
      return { ...state, loading: true };
    }

    case ParametrageActionType.UpdateSuccess: {
      return parametrageAdapter.setOne(action.parametrage, {
        ...state,
        error: false,
        loading: false
      });
    }

    case ParametrageActionType.UpdateFailure: {
      return parametrageAdapter.removeAll({
        ...state,
        error: true,
        loading: false
      });
    }

    case ParametrageActionType.LoadFailure: {
      return parametrageAdapter.removeAll({
        ...state,
        error: true,
        loading: false
      });
    }
    default:
      return state;
  }
}
