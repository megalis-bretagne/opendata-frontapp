import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import { of } from 'rxjs';
import {switchMap, map, catchError} from 'rxjs/operators';
import {PublicationsService} from '../../services/publications-service';
import {
  PublicationActionType,
  PublicationLoadFailAction,
  PublicationLoadSuccessAction, PublicationLoadAction
} from '../actions/publications.actions';
import {PublicationParams} from '../../models/publication-params';
import {PublicationResponse} from '../../models/publication-response';

@Injectable()
export class PublicationEffects {
  constructor(private service: PublicationsService, private actions$: Actions) { }

  public loadPublication$ = createEffect(
    () => this.actions$
      .pipe(ofType<PublicationLoadAction>(PublicationActionType.Loading),
      map(action => action.payload),
      switchMap((params: PublicationParams) =>
        this.service.searchPublications(params).pipe(
          map((response: PublicationResponse) => new PublicationLoadSuccessAction(response)),
          catchError((error) => of(new PublicationLoadFailAction(error)))
        )
      )
        ), { dispatch: true }
      );

}

