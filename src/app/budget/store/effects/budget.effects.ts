import { Inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, toArray } from "rxjs/operators";
import { BudgetService, BUDGET_SERVICE_TOKEN } from "../../services/budget.service";
import { BudgetActionType, BudgetLoadFailureAction, BudgetLoadingAction, BudgetLoadSuccessAction } from "../actions/budget.actions";

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
                map(action => [action.siren, action.annee]),
                switchMap(([siren, annee]) =>
                    this.budgetService.loadBudgets(siren as string, annee as number).pipe( toArray())
                ),
                map(lignes => new BudgetLoadSuccessAction(lignes)),
                catchError(err => of(new BudgetLoadFailureAction(err))),
            ),
        { dispatch: true }
    );
}