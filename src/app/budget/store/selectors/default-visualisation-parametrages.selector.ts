import { createFeatureSelector, createSelector } from "@ngrx/store";
import { DefaultVisualisationParametrageLocalisation } from "../../models/defaultvisualisation-parametrage";
import { defaultVisualisationParametrageAdapter, DefaultVisualisationParametrageState, toDefaultVisualisationParametrageStringId } from "../states/default-visualisation-parametrages.state";

export const {
    selectAll: dvpSelectAll,
    selectEntities: dvpSelectEntities,
    selectIds: dvpSelectIds,
    selectTotal: dvpSelectTotal,
} = defaultVisualisationParametrageAdapter.getSelectors()

export const selectDefaultVisualisationParametrageState = createFeatureSelector<DefaultVisualisationParametrageState>('defaultVisualisationParametrages')

const selectEntities = createSelector(
    selectDefaultVisualisationParametrageState,
    (state) => state.entities
)


const selectCallStates = createSelector(
    selectDefaultVisualisationParametrageState,
    state => state.callStates)


export const selectDefaultVisualisationParametragesPour = (localisation: DefaultVisualisationParametrageLocalisation) => createSelector(
    selectEntities,
    (entities) => {
        let str_id = toDefaultVisualisationParametrageStringId(localisation)
        return entities[str_id]
    } 
)

export const selectDefaultVisualisationParametrageCallStatePour = (localisation: DefaultVisualisationParametrageLocalisation) => createSelector(
    selectCallStates,
    callStates => {

        let _parent_localisation = { annee: localisation.annee, siret: localisation.siret, etape: localisation.etape }
        for (const _localisation of [localisation, _parent_localisation]) {
            
            let str_id = toDefaultVisualisationParametrageStringId(_localisation)
            let cs = callStates[str_id]
            if (cs !== undefined)
                return cs
        }

        return undefined
    }
)
