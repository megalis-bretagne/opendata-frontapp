import {User} from '../../models/models';
import { AuthActionTypes, All } from '../actions/auth.actions';

export interface State {
  // is a user authenticated?
  isAuthenticated: boolean;
  // if authenticated, there should be a user object
  user: User | null;
  // error message
  errorMessage: string | null;
}

export const initialAuthState: State = {
  isAuthenticated: false,
  user: null,
  errorMessage: null,
};

export function authReducer(state = initialAuthState, action: All): State {
  switch (action.type) {
    case AuthActionTypes.LOGIN_SUCCESS: {
      return {
        ...state,
        isAuthenticated: true,
        user: action.user,
        errorMessage: null
      };
    }
    case AuthActionTypes.LOGIN: {
      return {
        ...state,
        isAuthenticated: true,
        user: null,
        errorMessage: null
      };
    }
    case AuthActionTypes.LOGOUT: {
      return initialAuthState;
    }
    default: {
      return state;
    }
  }
}

