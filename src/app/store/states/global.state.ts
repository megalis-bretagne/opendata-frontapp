import * as auth from '../reducers/auth.reducer';
import {initialPublicationState, PublicationState} from './publication.state';
import {initialAuthState} from '../reducers/auth.reducer';
import {createFeatureSelector} from '@ngrx/store';
import {initialParametrageState, ParametrageState} from './parametrage.state';

export interface GlobalState {
  auth: auth.State;
  publications: PublicationState;
  parametrage: ParametrageState;
}

export const initialGlobalState: GlobalState = {
  publications: initialPublicationState,
  auth: initialAuthState,
  parametrage: initialParametrageState
};


export const selectAuthState = createFeatureSelector<auth.State>('auth');
