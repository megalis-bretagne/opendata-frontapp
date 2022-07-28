import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import {Parametrage} from '../../models/parametrage';

export interface ParametrageState extends EntityState<Parametrage> {
  error: boolean;
  loading: boolean;
}

export const parametrageAdapter: EntityAdapter<Parametrage> = createEntityAdapter<Parametrage>({
  selectId: (parametrage: Parametrage) => parametrage.id
});

export const initialParametrageState: ParametrageState = parametrageAdapter.getInitialState({
  error: false,
  loading: true
});
