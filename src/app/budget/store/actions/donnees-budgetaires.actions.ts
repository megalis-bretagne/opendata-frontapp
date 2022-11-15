import { Action } from "@ngrx/store";
import { Annee, Siret } from "../../models/common-types";
import { DonneesBudgetaires } from "../../models/donnees-budgetaires";
import { EtapeBudgetaire } from "../../models/etape-budgetaire";

export enum DonneesBudgetairesActionType {
    Noop = '[DonneesBudgetaires] Noop',
    Init = '[DonneesBudgetaires] Init',
    Loading = '[DonneesBudgetaires] Loading',
    LoadSuccess = '[DonneesBudgetaires] Successfully loaded',
    LoadFailure = '[DonneesBudgetaires] Failed to load',
}

export class DonnneesBudgetairesNoopAction implements Action {
    public readonly type = DonneesBudgetairesActionType.Noop
    constructor(public annee: Annee, public siret: Siret, public etape: EtapeBudgetaire) {}
}

export class DonnneesBudgetairesInitAction implements Action {
    public readonly type = DonneesBudgetairesActionType.Init
    constructor(public annee: Annee, public siret: Siret, public etape: EtapeBudgetaire) {}
}

export class DonnneesBudgetairesLoadingAction implements Action {
    public readonly type = DonneesBudgetairesActionType.Loading
    constructor(public annee: Annee, public siret: Siret, public etape: EtapeBudgetaire) {}
}

export class DonnneesBudgetairesLoadSuccessAction implements Action {
    public readonly type = DonneesBudgetairesActionType.LoadSuccess
    constructor(public annee: Annee, public siret: Siret, public etape: EtapeBudgetaire, public donnees: DonneesBudgetaires) {}
}

export class DonnneesBudgetairesLoadFailureAction implements Action {
    public readonly type = DonneesBudgetairesActionType.LoadFailure
    constructor(public annee: Annee, public siret: Siret, public etape: EtapeBudgetaire, public err: any) {}
}

export type DonneesBudgetairesAction = DonnneesBudgetairesNoopAction 
    | DonnneesBudgetairesInitAction
    | DonnneesBudgetairesLoadingAction
    | DonnneesBudgetairesLoadSuccessAction
    | DonnneesBudgetairesLoadFailureAction