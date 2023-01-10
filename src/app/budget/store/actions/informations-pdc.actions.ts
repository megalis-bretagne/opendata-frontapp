import { Action } from "@ngrx/store";
import { Annee, Siret } from "../../models/common-types";
import { Pdc } from "../../models/plan-de-comptes";

export enum InformationsPdcActionType {
    Init = '[Informations PDC] Init',
    Loading = '[Informations PDC] Loading',
    LoadSuccess = '[Informations PDC] Successfully loaded',
    LoadFailure = '[Informations PDC] Failed to load',
    Noop = '[Informations PDC] NOOP',
}


export class InformationsPdcInitAction implements Action {
    public readonly type = InformationsPdcActionType.Init
    constructor(public annee: Annee, public nomenclature: string) {}
}
export class InformationsPdcLoadingAction implements Action {
    public readonly type = InformationsPdcActionType.Loading
    constructor(public annee: Annee, public nomenclature: string) {}
}
export class InformationsPdcNoopAction implements Action {
    constructor(public annee: Annee, public nomenclature: string, public reason: string) {}
    public readonly type = InformationsPdcActionType.Noop
}
export class InformationsPdcLoadSuccessAction implements Action {
    public readonly type = InformationsPdcActionType.LoadSuccess
    constructor(public annee: Annee, public nomenclature: string, public infos_pdc: Pdc.InformationsPdc) {}
}
export class InformationsPdcLoadFailureAction implements Action {
    public readonly type = InformationsPdcActionType.LoadFailure
    constructor(public annee: Annee, public nomenclature: string, public err: any) {}
}

export type InformationsPdcAction = 
    InformationsPdcInitAction
    |InformationsPdcLoadingAction
    | InformationsPdcNoopAction 
    | InformationsPdcLoadSuccessAction
    | InformationsPdcLoadFailureAction