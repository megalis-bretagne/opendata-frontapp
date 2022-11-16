import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Siren } from "../../models/common-types";
import { donneesBudgetairesDisponiblesAdapter, DonneesBudgetairesDisponiblesState } from "../states/donnees-budgetaires-disponibles.state";
import { selectDonneesBudgetairesState } from "./donnees-budgetaires.selectors";

export const {
    selectAll: dbdSelectAll,
    selectEntities: dbdSelectEntities,
    selectIds: dbdSelectIds,
    selectTotal: dbdSelectTotal,
} = donneesBudgetairesDisponiblesAdapter.getSelectors()

export const selectDonneesBudgetairesDisponiblesState = createFeatureSelector<DonneesBudgetairesDisponiblesState>('donneesBudgetairesDisponibles')

const selectEntities = createSelector(
    selectDonneesBudgetairesDisponiblesState,
    (state) => state.entities
)

const selectCallStates = createSelector(
    selectDonneesBudgetairesDisponiblesState,
    state => state.callStates
)

export const selectDonneesBudgetairesDisponiblesPour = (siren: Siren) => createSelector(
    selectEntities,
    (entities) => {
        return entities[siren]
    }
)

export const selectDonneesBudgetairesDisponiblesPourSirenAlreadyLoaded = (siren: Siren) => createSelector(
    selectDonneesBudgetairesDisponiblesPour(siren),
    (disponibles) => Boolean(disponibles)
)

export const selectDonneesBudgetairesDisponiblesCallStatePour = (siren: Siren) => createSelector(
    selectCallStates,
    callStates => {
        return callStates[siren]
    }
)