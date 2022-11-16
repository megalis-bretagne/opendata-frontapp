import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Annee, Siret } from "../../models/common-types";
import { informationsPdcAdapter, InformationsPdcState, toStrInformationsPdcId } from "../states/informations-pdc.state";

export const {
    selectAll: pdcSelectAll,
    selectEntities: pdcSelectEntities,
    selectIds: pdcSelectIds,
    selectTotal: pdcSelectTotal,
} = informationsPdcAdapter.getSelectors()


export const selectInformationsPdcState = createFeatureSelector<InformationsPdcState>('informationsPdc')

const selectEntities = createSelector(selectInformationsPdcState,
    (state) => state.entities)

const selectCallStates = createSelector(selectInformationsPdcState,
    state => state.callStates)

export const selectInformationsPdcPour = (annee: Annee, siret: Siret) => createSelector(
    selectEntities,
    (entities) => {
        let str_id = toStrInformationsPdcId({annee, siret})
        return entities[str_id]
    }
)

export const selectInformationsPdcCallStatePour = (annee: Annee, siret: Siret) => createSelector(
    selectCallStates,
    callStates => {
        let str_id = toStrInformationsPdcId({annee, siret})
        return callStates[str_id]
    }
)
