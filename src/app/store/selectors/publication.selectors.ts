import { createSelector, createFeatureSelector } from '@ngrx/store';
import {publicationAdapter, PublicationState} from '../states/publication.state';

export const {
  selectIds: pselectPublicationDataIds,
  selectEntities: pselectPublicationEntities,
  selectAll: pselectAllPublication
  // selectTotal: pselectPublicationTotal
} = publicationAdapter.getSelectors();

export const selectPublicationState = createFeatureSelector<PublicationState>('publications');

export const selectPublicationIds = createSelector(
  selectPublicationState,
  pselectPublicationDataIds
);

export const selectPublicationEntities = createSelector(
  selectPublicationState,
  pselectPublicationEntities
);

export const selectAllPublication = createSelector(
  selectPublicationState,
  pselectAllPublication
);

export const selectPublicationError = createSelector(
  selectPublicationState,
  (state: PublicationState): boolean => state.error
);

export const selectPublicationLoading = createSelector(
  selectPublicationState,
  (state: PublicationState): boolean => state.loading
);

export const selectPublicationTotal = createSelector(
  selectPublicationState,
  (state: PublicationState): number => state.total
);
