
import { Inject, Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { DonneesBudgetaires } from "../../models/donnees-budgetaires";
import { BudgetService, BUDGET_SERVICE_TOKEN } from "../../services/budget.service";
import { DonneesBudgetairesActionType, DonnneesBudgetairesNoopAction, DonnneesBudgetairesLoadFailureAction, DonnneesBudgetairesLoadingAction, DonnneesBudgetairesLoadSuccessAction, DonnneesBudgetairesInitAction } from "../actions/donnees-budgetaires.actions";
import { InformationsPdcInitAction } from "../actions/informations-pdc.actions";
import { selectDonneesBudgtetairesCallStatePour } from "../selectors/donnees-budgetaires.selectors";
import { LoadingState } from "../states/call-states";
import { DonneesBudgetairesState } from "../states/donnees-budgetaires.state";

@Injectable()
export class DonneesBudgetairesEffects {
    constructor(
        @Inject(BUDGET_SERVICE_TOKEN)
        private budgetService: BudgetService,
        private actions$: Actions,
        private donneesBudgetairesStore: Store<DonneesBudgetairesState>,
    ) { }

    public initBudgets$ = createEffect(
        () => this.actions$
            .pipe(
                ofType<DonnneesBudgetairesInitAction>(DonneesBudgetairesActionType.Init),

                concatLatestFrom(action => this.donneesBudgetairesStore.select(selectDonneesBudgtetairesCallStatePour(action.annee, action.siret, action.etape))),

                switchMap(([action, callState]) => {
                    if (callState === LoadingState.LOADED || callState === LoadingState.LOADING)
                        return of(new DonnneesBudgetairesNoopAction(action.annee, action.siret, action.etape))

                    return of(new DonnneesBudgetairesLoadingAction(action.annee, action.siret, action.etape))
                }
                )
            ),
        { dispatch: true },
    );

    public loadBudgets$ = createEffect(
        () => this.actions$
            .pipe(
                ofType<DonnneesBudgetairesLoadingAction>(DonneesBudgetairesActionType.Loading),

                switchMap(action => {

                    let annee = action.annee
                    let siret = action.siret
                    let etape = action.etape

                    return this.budgetService.loadBudgets(annee, siret, etape)
                        .pipe(
                            map((donnees) =>
                                new DonnneesBudgetairesLoadSuccessAction(
                                    annee, siret, etape,
                                    donnees as DonneesBudgetaires
                                )
                            ),
                            catchError(err => {
                                console.error(err);
                                return of(new DonnneesBudgetairesLoadFailureAction(annee, siret, etape, err))
                            }),
                        );
                }
                )
            ),
        { dispatch: true },
    );

    public loadPdc$ = createEffect(
        () => this.actions$
            .pipe(
                ofType<DonnneesBudgetairesLoadSuccessAction>(DonneesBudgetairesActionType.LoadSuccess),

                switchMap(action => {

                    let annee = action.donnees.pdc_info.annee
                    let nomenclature = action.donnees.pdc_info.nomenclature

                    return of(new InformationsPdcInitAction(annee, nomenclature))
                })
            ),
        { dispatch: true },
    )
}