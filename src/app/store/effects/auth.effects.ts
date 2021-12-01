import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import {tap, map, switchMap, mapTo} from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import {
  AuthActionTypes,
  LogInSuccess,
} from '../actions/auth.actions';
import {User} from '../../models/user';


@Injectable()
export class AuthEffects {

  constructor(
    private actions: Actions,
    private authService: AuthService
  ) {}

  effectLogIn$ = createEffect(
    () => this.actions.pipe(
      ofType(AuthActionTypes.LOGIN),
      switchMap(() =>
        this.authService.checkLogin().then((profile) => {
            const user = new User();
            user.email = profile.email;
            user.username = profile.username;
            user.lastName = profile.lastName;
            user.firstName = profile.firstName;
            user.emailVerified = profile.emailVerified;
            // @ts-ignore
            user.id = profile.attributes.uid[0];
            // @ts-ignore
            user.externalId = profile.attributes.externalId[0];
            // @ts-ignore
            user.userType = profile.attributes.userType[0];
           // @ts-ignore
            user.role = profile.attributes.role[0];
            // @ts-ignore
            user.siren = profile.attributes.siren[0];
            return new LogInSuccess(user);
          }
        )),
    ), { dispatch: true }
  );
  effectLogInSuccess$ = createEffect(
    () => this.actions.pipe(
      ofType(AuthActionTypes.LOGIN_SUCCESS),

    ), { dispatch: false }
  );


  effectlogout$ = createEffect(
    () => this.actions.pipe(
      ofType(AuthActionTypes.LOGOUT),
      map(() => {
        this.authService.logout();
      })
    ), { dispatch: false }
);

}
