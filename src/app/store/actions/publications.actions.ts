import { Action } from '@ngrx/store';
import {PublicationParams} from '../../models/publication-params';
import {PublicationResponse} from '../../models/publication-response';

export enum PublicationActionType {
  Loading = '[Publication] Loading',
  LoadSuccess = '[Publication] LoadSuccess',
  LoadFailure = '[Publication] LoadFailure'
}

export class PublicationLoadAction implements Action {
  public readonly type = PublicationActionType.Loading;
  constructor(public payload: PublicationParams) {}
}

export class PublicationLoadSuccessAction implements Action {
  public readonly type = PublicationActionType.LoadSuccess;
  constructor(public payload: PublicationResponse) {}
}

export class PublicationLoadFailAction implements Action {
  public readonly type = PublicationActionType.LoadFailure;
  constructor(public error: any) {}
}

export type PublicationAction = PublicationLoadAction | PublicationLoadSuccessAction | PublicationLoadFailAction;
