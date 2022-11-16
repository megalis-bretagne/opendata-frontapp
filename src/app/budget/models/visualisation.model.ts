import { Annee, Siret } from "./common-types";
import { EtapeBudgetaire } from "./etape-budgetaire";

export namespace PagesDeVisualisations {

    export type PageId = 'default'

    const _pages = new Map<PageId, VisualisationGraphId[]>()
    _pages.set(
        'default',
        ['budget-principal-depenses', 'budget-principal-recettes', 'top-3-depenses'],
    );

    export function visualisation_pour_pageid(id: PageId) {
        return _pages.get(id)
    }
}

/** Identifiant d'une visualisation */
export type VisualisationGraphId =
    'budget-principal-depenses'
    | 'budget-principal-recettes'
    | 'top-3-depenses';

export interface IdentifiantVisualisation {
    annee: Annee
    siret: Siret
    etape: EtapeBudgetaire
    graphe_id: VisualisationGraphId
}

export interface ApiCallDesc {
    annee: Annee,
    siret: Siret,
    etape: EtapeBudgetaire,
}

export namespace VisualisationUtils {

    export function extract_api_call_descs(identifiants: IdentifiantVisualisation[]): ApiCallDesc[] {

        function _unique_reduce_fn(acc: ApiCallDesc[], curr: ApiCallDesc) {
            let found = acc.some(x => _eq(x, curr))

            if (found)
                return acc
            else
                return acc.concat(curr)
        }

        return identifiants
            .map(id => _to_api_call_desc(id))
            .reduce(
                _unique_reduce_fn,
                []
            )
    }

    function _to_api_call_desc(id: IdentifiantVisualisation): ApiCallDesc {
        return {
            annee: id.annee,
            siret: id.siret,
            etape: id.etape
        }
    }

    export function _eq(id1: ApiCallDesc, id2: ApiCallDesc) {
        return id1.annee === id2.annee
            && id1.siret === id2.siret
            && id1.etape === id2.etape
    }
}