import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import { of } from 'rxjs';
import {switchMap, map, catchError} from 'rxjs/operators';
import {ParametrageService} from '../../services/parametrage.service';
import {Parametrage} from '../../models/parametrage';
import {
  ParametrageActionType,
  ParametrageLoadAction,
  ParametrageLoadFailAction,
  ParametrageLoadSuccessAction, ParametrageUpdateAction, ParametrageUpdateFailAction, ParametrageUpdateSuccessAction
} from '../actions/parametrage.actions';

@Injectable()
export class ParametrageEffects {
  constructor(private service: ParametrageService, private actions$: Actions) { }

  public loadParametrage$ = createEffect(
    () => this.actions$
      .pipe(ofType<ParametrageLoadAction>(ParametrageActionType.Loading),
        map(action => action.siren),
        switchMap((siren: string) =>
          this.service.getParametrage(siren).pipe(
            map((parametrage: Parametrage) => new ParametrageLoadSuccessAction(parametrage)),
            catchError((error) => of(new ParametrageLoadFailAction(error)))
          )
        )
      ), { dispatch: true }
  );


  public updateParametrage$ = createEffect(
    () => this.actions$
      .pipe(ofType<ParametrageUpdateAction>(ParametrageActionType.Update),
        map(action => action.parametrage),
        switchMap((parametrage: Parametrage) =>
          this.service.updateParametrage(parametrage).pipe(
            map((reponseParametrage: Parametrage) => new ParametrageUpdateSuccessAction(reponseParametrage)),
            catchError((error) => of(new ParametrageUpdateFailAction(error)))
          )
        )
      ), { dispatch: true }
  );

}

