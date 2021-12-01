import {initialPublicationState, publicationAdapter, PublicationState} from '../states/publication.state';
import {PublicationAction, PublicationActionType} from '../actions/publications.actions';

export function publicationReducer(state = initialPublicationState, action: PublicationAction): PublicationState {
  switch (action.type) {
    case PublicationActionType.Loading: {
      return { ...state, loading: true };
    }
    case PublicationActionType.LoadSuccess: {
      return publicationAdapter.setAll(action.payload.publications, {
        ...state,
        error: false,
        loading: false,
        total: action.payload.total
      });
    }
    case PublicationActionType.LoadFailure: {
      return publicationAdapter.removeAll({
        ...state,
        error: true,
        loading: false,
        total: 0
      });
    }
    default:
      return state;
  }
}
