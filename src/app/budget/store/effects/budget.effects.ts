import { Inject, Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { createSelector, Store } from "@ngrx/store";
import { of, zip } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { DonneesBudgetaires } from "../../models/donnees-budgetaires";
import { EtapeBudgetaire } from "../../models/etape-budgetaire";
import { BudgetService, BUDGET_SERVICE_TOKEN } from "../../services/budget.service";
import { BudgetActionType, BudgetAlreadyLoadedAction, BudgetDisponiblesAlreadyLoadedAction, BudgetDisponiblesLoadFailureAction, BudgetDisponiblesLoadingAction, BudgetDisponiblesLoadSuccessAction, BudgetLoadFailureAction, BudgetLoadingAction, BudgetLoadSuccessAction } from "../actions/budget.actions";
import { BudgetState, selectDonnees, selectDonneesDisponibles } from "../states/budget.state";

const donneesDisponiblesAlreadyLoaded = (siren: string) => createSelector(
    selectDonneesDisponibles(siren),
    (disponibles) => Boolean(disponibles)
)

const donneesBudgetAlreadyLoaded = (annee: string, siret: string, etape: EtapeBudgetaire) => createSelector(
    selectDonnees(annee, siret, etape),
    (donnees) => Boolean(donnees)
)

// 
@Injectable()
export class BudgetEffects {
    constructor(
        @Inject(BUDGET_SERVICE_TOKEN)
        private budgetService: BudgetService,
        private actions$: Actions,
        private budgetStore: Store<BudgetState>,
    ) { }

    public loadBudgets$ = createEffect(
        () => this.actions$
            .pipe(
                ofType<BudgetLoadingAction>(BudgetActionType.Loading),

                concatLatestFrom(action => this.budgetStore.select(donneesBudgetAlreadyLoaded(action.annee, action.siret, action.etape))),
                // tap(([action, loaded]) => console.debug(`${action.siret} - ${action.annee} - ${action.etape} loaded: ${loaded}`)),

                switchMap(([action, alreadyLoaded]) => {

                    if (alreadyLoaded)
                        return of(new BudgetAlreadyLoadedAction())

                    let loadDonnees = this.budgetService.loadBudgets(
                        action.annee,
                        action.siret,
                        action.etape
                    );

                    let loadInformationsPdc = this.budgetService.loadInformationPdc(action.annee, action.siret);

                    let zipped = zip(loadDonnees, loadInformationsPdc)
                        .pipe(
                            map(([donnees, informationsPdc]) =>
                                new BudgetLoadSuccessAction(donnees as DonneesBudgetaires, informationsPdc)
                            ),
                            catchError(err => {
                                console.error(err);
                                return of(new BudgetLoadFailureAction(err))
                            })
                        );

                    return zipped;
                }
                )
            ),
        { dispatch: true },
    );

    public loadDonneesBudgetairesDisponibles$ = createEffect(
        () => this.actions$
            .pipe(
                ofType<BudgetDisponiblesLoadingAction>(BudgetActionType.LoadingDisponibles),
                map(action => action.siren),

                concatLatestFrom(siren => this.budgetStore.select(donneesDisponiblesAlreadyLoaded(siren))),
                // tap(([siren, loaded]) => console.debug(`${siren} loaded: ${loaded}`)),

                switchMap(([siren, alreadyLoaded]) => {

                    if (alreadyLoaded)
                        return of(new BudgetDisponiblesAlreadyLoadedAction())

                    return this.budgetService.donneesBudgetairesDisponibles(siren)
                        .pipe(
                            map(disponibles => new BudgetDisponiblesLoadSuccessAction(disponibles)),
                            catchError(err => of(new BudgetDisponiblesLoadFailureAction(err))),
                        )
                }),
            ),
        { dispatch: true },
    )
}