import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import {Publication} from '../../models/publication';
import {Parametrage} from '../../models/parametrage';

export interface ParametrageState extends EntityState<Parametrage> {
  error: boolean;
  loading: boolean;
}

export const parametrageAdapter: EntityAdapter<Publication> = createEntityAdapter<Publication>({
  selectId: (parametrage: Parametrage) => parametrage.id
});

export const initialParametrageState: ParametrageState = parametrageAdapter.getInitialState({
  error: false,
  loading: true
});
