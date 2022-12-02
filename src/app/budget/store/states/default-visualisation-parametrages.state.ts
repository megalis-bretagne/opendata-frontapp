import { createEntityAdapter } from "@ngrx/entity";
import { EntityState } from "@ngrx/entity/src/models";
import { DefaultVisualisationParametrage, DefaultVisualisationParametrageLocalisation } from "../../models/defaultvisualisation-parametrage";
import { CallStates } from "./call-states";

export function toDefaultVisualisationParametrageStringId (localisation: Partial<DefaultVisualisationParametrageLocalisation>) {
    let result = ``

    if (!localisation)
        return result
    
    if (localisation.annee)
        result += localisation.annee

    if (localisation.siret)
        result += `-${localisation.siret}`

    if (localisation.etape)
        result += `-${localisation.etape}`

    if (localisation.graphe_id)
        result += `-${localisation.graphe_id}`

    return result
}

export interface DefaultVisualisationParametrageState extends EntityState<DefaultVisualisationParametrage> {
    callStates: CallStates
}

export const defaultVisualisationParametrageAdapter = createEntityAdapter<DefaultVisualisationParametrage>({
    selectId: (parametrage) => toDefaultVisualisationParametrageStringId(parametrage.localisation)
})

export const initialDefaultVisualisationParametrageState = defaultVisualisationParametrageAdapter.getInitialState({
    callStates: {},
})
