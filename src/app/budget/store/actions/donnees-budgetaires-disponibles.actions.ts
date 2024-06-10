import { Action } from "@ngrx/store";
import { Siren } from "../../models/common-types";
import { DonneesBudgetairesDisponibles } from "../../models/donnees-budgetaires-disponibles";

export enum DonneesBudgetairesDisponiblesActionType {
    Init = '[Budgets - disponibles] Init',
    Loading = '[Budgets - disponibles] Loading',
    Noop = '[Budgets - disponibles] Noop',
    LoadSuccess = '[Budgets - disponibles] Successfully loaded',
    LoadFailure = '[Budgets - disponibles] Failed to load',
}

export class BudgetDisponiblesNoopAction implements Action {
    constructor(public siren: Siren) {}
    public readonly type = DonneesBudgetairesDisponiblesActionType.Noop;
}
export class BudgetDisponiblesInitAction implements Action {
    public readonly type = DonneesBudgetairesDisponiblesActionType.Init;
    constructor(public siren: Siren) {}
}
export class BudgetDisponiblesLoadingAction implements Action {
    public readonly type = DonneesBudgetairesDisponiblesActionType.Loading;
    constructor(public siren: Siren) {}
}
export class BudgetDisponiblesLoadSuccessAction implements Action {
    public readonly type = DonneesBudgetairesDisponiblesActionType.LoadSuccess;
    constructor(public siren: Siren, public disponibles: DonneesBudgetairesDisponibles) {}
}
export class BudgetDisponiblesLoadFailureAction implements Action {
    public readonly type = DonneesBudgetairesDisponiblesActionType.LoadFailure;
    constructor(public siren: Siren, public error: any) { }
}

export type DonneesBudgetairesDisponiblesAction = BudgetDisponiblesInitAction
    | BudgetDisponiblesLoadingAction
    | BudgetDisponiblesNoopAction
    | BudgetDisponiblesLoadSuccessAction
    | BudgetDisponiblesLoadFailureAction;