import { Action } from "@ngrx/store";
import { DonneesBudgetairesDisponibles } from "../../models/donnees-budgetaires-disponibles";
import { Pdc } from "../../models/plan-de-comptes";
import { EtapeBudgetaire } from "../../services/budget.service";
import { DonneesBudgetaires } from "../states/budget.state";

export enum BudgetActionType {
    Loading = '[Budget] Loading',
    LoadSuccess = '[Budget] LoadSuccess',
    LoadFailure = '[Budget] LoadFailure',

    LoadingDisponibles = '[Budget - disponibles] Loading',
    LoadDisponiblesSuccess = '[Budget - disponibles] LoadSuccess',
    LoadDisponiblesFailure = '[Budget - disponibles] LoadFailure',
}

export class BudgetLoadingAction implements Action {
    public readonly type = BudgetActionType.Loading;
    constructor(public siren: string, public annee: string, public etape: EtapeBudgetaire) { }
}
export class BudgetLoadSuccessAction implements Action {
    public readonly type = BudgetActionType.LoadSuccess;
    constructor(public donnees: DonneesBudgetaires, public informationPdc: Pdc.InformationPdc) { }
}
export class BudgetLoadFailureAction implements Action {
    public readonly type = BudgetActionType.LoadFailure;
    constructor(public error: any) { }
}

export class BudgetDisponiblesLoadingAction implements Action {
    public readonly type = BudgetActionType.LoadingDisponibles;
    constructor(public siren: string) {}
}
export class BudgetDisponiblesLoadSuccessAction implements Action {
    public readonly type = BudgetActionType.LoadDisponiblesSuccess;
    constructor(public disponibles: DonneesBudgetairesDisponibles) {}
}
export class BudgetDisponiblesLoadFailureAction implements Action {
    public readonly type = BudgetActionType.LoadDisponiblesFailure;
    constructor(public error: any) {}
}

export type BudgetAction = BudgetLoadingAction
    | BudgetLoadSuccessAction
    | BudgetLoadFailureAction
    | BudgetDisponiblesLoadingAction
    | BudgetDisponiblesLoadSuccessAction
    | BudgetDisponiblesLoadFailureAction
    ;