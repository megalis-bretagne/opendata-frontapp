import { Action } from '@ngrx/store';
import { User } from '../../models/models';

export enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGIN_SUCCESS = '[Auth] Login Success',
  LOGIN_FAILURE = '[Auth] Login Failure',
  LOGOUT = '[Auth] Logout',
}

export class LogInSuccess implements Action {
  readonly type = AuthActionTypes.LOGIN_SUCCESS;
  constructor(public user: User) {}
}

export class LogOut implements Action {
  readonly type = AuthActionTypes.LOGOUT;
}

export class LogIn implements Action {
  readonly type = AuthActionTypes.LOGIN;
}

export type All =
  | LogIn
  | LogInSuccess
  | LogOut;

