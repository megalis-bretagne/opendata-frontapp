import { createSelector, createFeatureSelector } from '@ngrx/store';
import {parametrageAdapter, ParametrageState} from '../states/parametrage.state';

export const {
  selectIds: pselectParametrageDataIds,
  selectEntities: pselectParametrageEntities,
  selectAll: pselectAllParametrage
} = parametrageAdapter.getSelectors();

export const selectParametrageState = createFeatureSelector<ParametrageState>('parametrage');

export const selectParametrageIds = createSelector(
  selectParametrageState,
  pselectParametrageDataIds
);

export const selectParametrageEntities = createSelector(
  selectParametrageState,
  pselectParametrageEntities
);

export const selectAllParametrage = createSelector(
  selectParametrageState,
  pselectAllParametrage
);

export const selectParametrageError = createSelector(
  selectParametrageState,
  (state: ParametrageState): boolean => state.error
);

export const selectParametrageLoading = createSelector(
  selectParametrageState,
  (state: ParametrageState): boolean => state.loading
);
