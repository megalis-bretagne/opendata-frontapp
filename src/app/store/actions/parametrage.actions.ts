import { Action } from '@ngrx/store';
import {Parametrage} from '../../models/parametrage';

export enum ParametrageActionType {
  Loading = '[Parametrage] Loading',
  LoadSuccess = '[Parametrage] LoadSuccess',
  LoadFailure = '[Parametrage] LoadFailure',
  Update = '[Parametrage] Update',
  UpdateSuccess = '[Parametrage] UpdateSuccess',
  UpdateFailure = '[Parametrage] UpdateFailure'
}

export class ParametrageLoadAction implements Action {
  public readonly type = ParametrageActionType.Loading;
  constructor(public siren: string) {}
}

export class ParametrageLoadSuccessAction implements Action {
  public readonly type = ParametrageActionType.LoadSuccess;
  constructor(public parametrage: Parametrage) {}
}

export class ParametrageLoadFailAction implements Action {
  public readonly type = ParametrageActionType.LoadFailure;
  constructor(public error: any) {}
}

export class ParametrageUpdateAction implements Action {
  public readonly type = ParametrageActionType.Update;
  constructor(public parametrage: Parametrage) {}
}

export class ParametrageUpdateSuccessAction implements Action {
  public readonly type = ParametrageActionType.UpdateSuccess;
  constructor(public parametrage: Parametrage) {}
}

export class ParametrageUpdateFailAction implements Action {
  public readonly type = ParametrageActionType.UpdateFailure;
  constructor(public error: any) {}
}

export type ParametrageAction = ParametrageLoadAction |
                                ParametrageLoadSuccessAction |
                                ParametrageLoadFailAction |
                                ParametrageUpdateAction |
                                ParametrageUpdateSuccessAction |
                                ParametrageUpdateFailAction;
