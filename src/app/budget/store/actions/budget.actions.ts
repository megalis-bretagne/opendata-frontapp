import { Action } from "@ngrx/store";
import { DonneesBudgetairesDisponibles } from "../../models/donnees-budgetaires-disponibles";
import { DonneesBudgetaires } from "../../models/donnees-budgetaires";
import { Pdc } from "../../models/plan-de-comptes";
import { EtapeBudgetaire } from "../../models/etape-budgetaire";
import { Annee, Siren, Siret } from "../../models/common-types";

export enum BudgetActionType {
    Loading = '[Budget] Loading',
    AlreadyLoaded = '[Budget] AlreadyLoaded',
    LoadSuccess = '[Budget] LoadSuccess',
    LoadFailure = '[Budget] LoadFailure',

    LoadingDisponibles = '[Budget - disponibles] Loading',
    LoadDisponiblesAlreadyLoaded = '[Budget - disponibles] AlreadyLoaded',
    LoadDisponiblesSuccess = '[Budget - disponibles] LoadSuccess',
    LoadDisponiblesFailure = '[Budget - disponibles] LoadFailure',
}

export class BudgetLoadingAction implements Action {
    public readonly type = BudgetActionType.Loading;
    constructor(public annee: Annee, public siret: Siret, public etape: EtapeBudgetaire) { }
}
export class BudgetAlreadyLoadedAction implements Action {
    public readonly type = BudgetActionType.AlreadyLoaded;
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
    constructor(public siren: Siren) {}
}
export class BudgetDisponiblesAlreadyLoadedAction implements Action {
    public readonly type = BudgetActionType.LoadDisponiblesAlreadyLoaded;
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
    | BudgetAlreadyLoadedAction
    | BudgetLoadSuccessAction
    | BudgetLoadFailureAction
    | BudgetDisponiblesLoadingAction
    | BudgetDisponiblesAlreadyLoadedAction
    | BudgetDisponiblesLoadSuccessAction
    | BudgetDisponiblesLoadFailureAction
    ;