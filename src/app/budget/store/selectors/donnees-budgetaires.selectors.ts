import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Annee, Siret } from "../../models/common-types";
import { EtapeBudgetaire } from "../../models/etape-budgetaire";
import { donneesBudgetairesAdapter, DonneesBudgetairesState, toDonneesBudgetairesStringId } from "../states/donnees-budgetaires.state";

export const {
    selectAll: dbSelectAll,
    selectEntities: dbSelectEntities,
    selectIds: dbSelectIds,
    selectTotal: dbSelectTotal,
} = donneesBudgetairesAdapter.getSelectors()

export const selectDonneesBudgetairesState = createFeatureSelector<DonneesBudgetairesState>('donneesBudgetaires')

const selectEntities = createSelector(
    selectDonneesBudgetairesState,
    state => state.entities
)

const selectCallStates = createSelector(
    selectDonneesBudgetairesState,
    state => state.callStates)

export const selectDonneesPour = (annee: Annee, siret: Siret, etape: EtapeBudgetaire) => createSelector(
    selectEntities,
    (entities) => {
        let str_id = toDonneesBudgetairesStringId({ annee, siret, etape })
        return entities[str_id]
    } 
)

export const selectDonneesBudgtetairesCallStatePour = (annee: Annee, siret: Siret, etape: EtapeBudgetaire) => createSelector(
    selectCallStates,
    callStates => {
        let str_id = toDonneesBudgetairesStringId({annee, siret, etape})
        return callStates[str_id]
    }
)