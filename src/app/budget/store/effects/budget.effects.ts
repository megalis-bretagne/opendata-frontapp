import { Inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { BudgetService, BUDGET_SERVICE_TOKEN, EtapeBudgetaire } from "../../services/budget.service";
import { BudgetActionType, BudgetAnneesDisponiblesLoadFailureAction, BudgetAnneesDisponiblesLoadingAction, BudgetAnneesDisponiblesLoadSuccessAction, BudgetLoadFailureAction, BudgetLoadingAction, BudgetLoadSuccessAction } from "../actions/budget.actions";

@Injectable()
export class BudgetEffects {
    constructor(
        @Inject(BUDGET_SERVICE_TOKEN)
        private budgetService: BudgetService,
        private actions$: Actions
    ) { }

    public loadBudgets$ = createEffect(
        () => this.actions$
            .pipe(
                ofType<BudgetLoadingAction>(BudgetActionType.Loading),
                map(action => [action.siren, action.etape, action.annee]),
                switchMap(([siren, etape, annee]) => {
                    let loadDonnees = this.budgetService.loadBudgets(
                        siren as string,
                        etape as EtapeBudgetaire,
                        annee as number
                    ).pipe(
                        map(donnees => {
                            return new BudgetLoadSuccessAction(donnees)
                        }),
                        catchError(err => {
                            console.error(err)
                            return of(new BudgetLoadFailureAction(err))
                        })
                    );

                    return loadDonnees;
                }
                ),
            ),
        { dispatch: true },
    );

    public loadAnneesDisponibles$ = createEffect(
        () => this.actions$
            .pipe(
                ofType<BudgetAnneesDisponiblesLoadingAction>(BudgetActionType.LoadingAnneesDisponibles),
                map(action => action.siren),
                switchMap(siren => this.budgetService.anneesDisponibles(siren)),
                map(annees => new BudgetAnneesDisponiblesLoadSuccessAction(annees)),
                catchError(err => of(new BudgetAnneesDisponiblesLoadFailureAction(err)))
            ),
        { dispatch: true },
    )
}