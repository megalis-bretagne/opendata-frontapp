import { Action } from "@ngrx/store";
import { LigneBudget } from "../states/budget.state";

export enum BudgetActionType {
    Loading = '[Budget] Loading',
    LoadSuccess = '[Budget] LoadSuccess',
    LoadFailure = '[Budget] LoadFailure',
}

export class BudgetLoadingAction implements Action {
    public readonly type = BudgetActionType.Loading;
    constructor(public siren: string, public annee: number) { }
}
export class BudgetLoadSuccessAction implements Action {
    public readonly type = BudgetActionType.LoadSuccess;
    constructor(public lignes: LigneBudget[]) { }
}
export class BudgetLoadFailureAction implements Action {
    public readonly type = BudgetActionType.LoadFailure;
    constructor(public error: any) { }
}

export type BudgetAction = BudgetLoadingAction
    | BudgetLoadSuccessAction
    | BudgetLoadFailureAction;