import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import {Publication} from '../../models/publication';

export interface PublicationState extends EntityState<Publication> {
  error: boolean;
  loading: boolean;
  total: number;
}

export const publicationAdapter: EntityAdapter<Publication> = createEntityAdapter<Publication>({
  selectId: (publication: Publication) => publication.id
});

export const initialPublicationState: PublicationState = publicationAdapter.getInitialState({
  error: false,
  loading: true,
  total: 0
});
