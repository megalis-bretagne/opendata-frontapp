import { Action } from "@ngrx/store";
import { Pdc } from "../../models/plan-de-comptes";
import { EtapeBudgetaire } from "../../services/budget.service";
import { DonneesBudget } from "../states/budget.state";

export enum BudgetActionType {
    Loading = '[Budget] Loading',
    LoadSuccess = '[Budget] LoadSuccess',
    LoadFailure = '[Budget] LoadFailure',

    LoadingAnneesDisponibles = '[Budget - années] Loading',
    LoadAnneesDisponiblesSuccess = '[Budget - années] LoadSuccess',
    LoadAnneesDisponiblesFailure = '[Budget - années] LoadFailure',
}

export class BudgetLoadingAction implements Action {
    public readonly type = BudgetActionType.Loading;
    constructor(public siren: string, public annee: number, public etape: EtapeBudgetaire) { }
}
export class BudgetLoadSuccessAction implements Action {
    public readonly type = BudgetActionType.LoadSuccess;
    constructor(public donnees: DonneesBudget, public informationPdc: Pdc.InformationPdc) { }
}
export class BudgetLoadFailureAction implements Action {
    public readonly type = BudgetActionType.LoadFailure;
    constructor(public error: any) { }
}

export class BudgetAnneesDisponiblesLoadingAction implements Action {
    public readonly type = BudgetActionType.LoadingAnneesDisponibles;
    constructor(public siren: string) { }
}
export class BudgetAnneesDisponiblesLoadSuccessAction implements Action {
    public readonly type = BudgetActionType.LoadAnneesDisponiblesSuccess;
    constructor(public annees: number[]) { }
}
export class BudgetAnneesDisponiblesLoadFailureAction implements Action {
    public readonly type = BudgetActionType.LoadAnneesDisponiblesFailure;
    constructor(public error: any) { }
}

export type BudgetAction = BudgetLoadingAction
    | BudgetLoadSuccessAction
    | BudgetLoadFailureAction
    | BudgetAnneesDisponiblesLoadingAction
    | BudgetAnneesDisponiblesLoadSuccessAction
    | BudgetAnneesDisponiblesLoadFailureAction;