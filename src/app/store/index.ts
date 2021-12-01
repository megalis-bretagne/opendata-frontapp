import { ActionReducerMap } from '@ngrx/store';
import { GlobalState } from './states/global.state';
import {publicationReducer} from './reducers/publications.reducer';
import {authReducer} from './reducers/auth.reducer';
import {parametrageReducer} from './reducers/parametrage.reducer';

export const reducers: ActionReducerMap<GlobalState> = {
  auth: authReducer,
  publications: publicationReducer,
  parametrage: parametrageReducer
};
