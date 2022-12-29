import { Inject, Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { BudgetService, BUDGET_SERVICE_TOKEN } from "../../services/budget.service";
import { InformationsPdcActionType, InformationsPdcNoopAction, InformationsPdcLoadFailureAction, InformationsPdcLoadingAction, InformationsPdcLoadSuccessAction, InformationsPdcInitAction } from "../actions/informations-pdc.actions";
import { selectInformationsPdcCallStatePour } from "../selectors/informations-pdc.selectors";
import { LoadingState } from "../states/call-states";
import { InformationsPdcState } from "../states/informations-pdc.state";

@Injectable()
export class InformationsPdcEffects {
    constructor(
        @Inject(BUDGET_SERVICE_TOKEN)
        private budgetService: BudgetService,
        private actions$: Actions,
        private informationsPdcStore: Store<InformationsPdcState>,
    ) { }


    public initPdc$ = createEffect(
        () => this.actions$
            .pipe(
                ofType<InformationsPdcInitAction>(InformationsPdcActionType.Init),

                concatLatestFrom(action => this.informationsPdcStore.select(selectInformationsPdcCallStatePour(action.annee, action.nomenclature))),

                switchMap(([action, callState]) => {

                    if (callState === LoadingState.LOADED || callState === LoadingState.LOADING)
                        return of(new InformationsPdcNoopAction(action.annee, action.nomenclature, 'Chargement en cours ou déjà réalisé'))

                    return of(new InformationsPdcLoadingAction(action.annee, action.nomenclature))
                })
            ),
        { dispatch: true }
    )

    public loadPdc$ = createEffect(
        () => this.actions$
            .pipe(
                ofType<InformationsPdcLoadingAction>(InformationsPdcActionType.Loading),
                switchMap(action => {
                    return this.budgetService.loadInformationPdc(action.annee, action.nomenclature)
                        .pipe(
                            map(pdc => new InformationsPdcLoadSuccessAction(action.annee, action.nomenclature, pdc)),
                            catchError(err => of(new InformationsPdcLoadFailureAction(action.annee, action.nomenclature, err))),
                        )
                })
            ),
        { dispatch: true }
    )
}