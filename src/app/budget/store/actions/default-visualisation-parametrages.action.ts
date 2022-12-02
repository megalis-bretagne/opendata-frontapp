import { Action } from "@ngrx/store"
import { Annee, Siret } from "../../models/common-types"
import { DefaultVisualisationParametrage } from "../../models/defaultvisualisation-parametrage"
import { EtapeBudgetaire } from "../../models/etape-budgetaire"
import { VisualisationGraphId } from "../../models/visualisation.model"

export enum DefaultVisualisationParametrageActionType {
    Noop = '[DefaultVisualisationParametrage] Noop',
    Init = '[DefaultVisualisationParametrage] Init',
    Loading = '[DefaultVisualisationParametrage] Loading',
    LoadSuccess = '[DefaultVisualisationParametrage] Successfully loaded',
    LoadFailure = '[DefaultVisualisationParametrage] Failed to load',

    Edit = '[DefaultVisualisationParametrage] Edit',
    EditSuccess = '[DefaultVisualisationParametrage] EditSuccess',
    EditFailure = '[DefaultVisualisationParametrage] EditFailure',
}

export class DefaultVisualisationParametrageNoopAction implements Action {
    public readonly type = DefaultVisualisationParametrageActionType.Noop
    constructor(public annee: Annee, public siret: Siret, public etape: EtapeBudgetaire) { }
}

export class DefaultVisualisationParametrageInitAction implements Action {
    public readonly type = DefaultVisualisationParametrageActionType.Init
    constructor(public annee: Annee, public siret: Siret, public etape: EtapeBudgetaire) { }
}

export class DefaultVisualisationParametrageLoadingAction implements Action {
    public readonly type = DefaultVisualisationParametrageActionType.Loading
    constructor(public annee: Annee, public siret: Siret, public etape: EtapeBudgetaire) { }
}

export class DefaultVisualisationParametrageLoadSuccessAction implements Action {
    public readonly type = DefaultVisualisationParametrageActionType.LoadSuccess
    constructor(public annee: Annee, public siret: Siret, public etape: EtapeBudgetaire, public donnees: DefaultVisualisationParametrage[]) { }
}

export class DefaultVisualisationParametrageLoadFailureAction implements Action {
    public readonly type = DefaultVisualisationParametrageActionType.LoadFailure
    constructor(public annee: Annee, public siret: Siret, public etape: EtapeBudgetaire, public err: any) { }
}

export class DefaultVisualisationParametrageEditAction implements Action {
    public readonly type = DefaultVisualisationParametrageActionType.Edit
    constructor(
        public annee: Annee, 
        public siret: Siret, 
        public etape: EtapeBudgetaire, 
        public graphe_id: VisualisationGraphId, 
        public titre: string,
        public sous_titre: string,
    ) { }
}

export class DefaultVisualisationParametrageEditSuccessAction implements Action {
    public readonly type = DefaultVisualisationParametrageActionType.EditSuccess
    constructor(
        public annee: Annee, 
        public siret: Siret, 
        public etape: EtapeBudgetaire, 
        public graphe_id: VisualisationGraphId, 
        public parametrage: DefaultVisualisationParametrage,
    ) { }
}

export class DefaultVisualisationParametrageEditFailureAction implements Action {
    public readonly type = DefaultVisualisationParametrageActionType.EditFailure
    constructor(
        public annee: Annee, 
        public siret: Siret, 
        public etape: EtapeBudgetaire, 
        public graphe_id: VisualisationGraphId, 
        public titre: string,
        public sous_titre: string,
    ) { }
}

export type DefaultVisualisationParametrageAction = DefaultVisualisationParametrageNoopAction
    | DefaultVisualisationParametrageInitAction
    | DefaultVisualisationParametrageLoadingAction
    | DefaultVisualisationParametrageLoadSuccessAction
    | DefaultVisualisationParametrageLoadFailureAction
    | DefaultVisualisationParametrageEditAction
    | DefaultVisualisationParametrageEditSuccessAction
    | DefaultVisualisationParametrageEditFailureAction