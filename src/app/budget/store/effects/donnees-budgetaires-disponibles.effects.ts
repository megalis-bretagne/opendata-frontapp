import { Inject, Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { BudgetService, BUDGET_SERVICE_TOKEN } from "../../services/budget.service";
import { BudgetDisponiblesNoopAction, BudgetDisponiblesInitAction, BudgetDisponiblesLoadFailureAction, BudgetDisponiblesLoadingAction, BudgetDisponiblesLoadSuccessAction, DonneesBudgetairesDisponiblesActionType } from "../actions/donnees-budgetaires-disponibles.actions";
import { selectDonneesBudgetairesDisponiblesCallStatePour } from "../selectors/donnees-budgetaires-disponibles.selectors";
import { LoadingState } from "../states/call-states";
import { DonneesBudgetairesDisponiblesState } from "../states/donnees-budgetaires-disponibles.state";

@Injectable()
export class DonneesBudgetairesDisponiblesEffects {

    constructor(
        @Inject(BUDGET_SERVICE_TOKEN)
        private budgetService: BudgetService,
        private actions$: Actions,
        private donneesBudgetairesDisponiblesStore: Store<DonneesBudgetairesDisponiblesState>,
    ) { }

    public initDonneesBudgetairesDisponibles$ = createEffect(
        () => this.actions$
            .pipe(
                ofType<BudgetDisponiblesInitAction>(DonneesBudgetairesDisponiblesActionType.Init),
                map(action => action.siren),

                concatLatestFrom(siren => this.donneesBudgetairesDisponiblesStore.select(selectDonneesBudgetairesDisponiblesCallStatePour(siren))),

                switchMap(([siren, callState]) => {

                    if (callState === LoadingState.LOADED || callState === LoadingState.LOADING)
                        return of(new BudgetDisponiblesNoopAction(siren))

                    return of(new BudgetDisponiblesLoadingAction(siren))
                }),
            ),
        { dispatch: true },
    )

    public loadDonneesBudgetairesDisponibles$ = createEffect(
        () => this.actions$
            .pipe(
                ofType<BudgetDisponiblesLoadingAction>(DonneesBudgetairesDisponiblesActionType.Loading),
                map(action => action.siren),
                switchMap(siren => {
                    return this.budgetService.donneesBudgetairesDisponibles(siren)
                        .pipe(
                            map(disponibles => new BudgetDisponiblesLoadSuccessAction(siren, disponibles)),
                            catchError(err => of(new BudgetDisponiblesLoadFailureAction(siren, err))),
                        )
                })
            ),
        { dispatch: true }
    )

}