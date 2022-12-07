import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Annee, Siret } from "../../models/common-types";
import { DonneesBudgetaires } from "../../models/donnees-budgetaires";
import { EtapeBudgetaire } from "../../models/etape-budgetaire";
import { CallStates } from "./call-states";

export interface DonneesBudgetairesId {
    annee: Annee,
    siret: Siret,
    etape: EtapeBudgetaire,
}

export function toDonneesBudgetairesStringId(id: DonneesBudgetairesId | Partial<DonneesBudgetaires>) {
    return `${id.annee}-${id.siret}-${id.etape}`
}

export interface DonneesBudgetairesState extends EntityState<DonneesBudgetaires> {
    callStates: CallStates
}

export const donneesBudgetairesAdapter: EntityAdapter<DonneesBudgetaires> = createEntityAdapter<DonneesBudgetaires>({
    selectId: (donneesBudgetaires) => toDonneesBudgetairesStringId(donneesBudgetaires)
})

export const initialDonneesBudgetairesState: DonneesBudgetairesState = donneesBudgetairesAdapter.getInitialState({ 
    callStates: {},
})