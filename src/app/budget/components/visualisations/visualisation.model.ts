import { identifierName } from "@angular/compiler";
import { Annee, Siret } from "../../models/donnees-budgetaires-disponibles";
import { EtapeBudgetaire } from "../../services/budget.service";

/** Identifiant d'une visualisation */
export type VisualisationGraphId =
    'budget-principal-depenses'   
    | 'budget-principal-recettes'
    | 'budget-principal-top-3';

export interface IdentifiantVisualisation {
    annee: Annee
    siret: Siret
    etape: EtapeBudgetaire
    graphe_id: VisualisationGraphId
}

export namespace VisualisationUtils {
    export function distinct(identifiants: IdentifiantVisualisation[]) {

        function _unique_reduce_fn(acc: IdentifiantVisualisation[], curr: IdentifiantVisualisation) {
            let found = acc.some(x => _eq(x, curr))

            if (found)
                return acc
            else
                return acc.concat(curr)
        }

        return identifiants.reduce(
            _unique_reduce_fn,
            []
        )
    }

    export function _eq(id1: IdentifiantVisualisation, id2: IdentifiantVisualisation) {
        return id1.annee === id2.annee
            && id1.siret === id2.siret
            && id1.etape === id2.etape
            && id1.graphe_id === id2.graphe_id
    }
}