import { Injectable } from '@angular/core';
import { Annee, Siret } from '../models/common-types';
import { EtapeBudgetaire } from '../models/etape-budgetaire';
import { VisualisationGraphId } from '../models/visualisation.model';

export const ROUTE_PREFIX_MODULE = 'budgets'

export const ROUTE_CONSULTATION_PREFIX = 'public'
export const ROUTE_CONSULTATION_PATH = `${ROUTE_CONSULTATION_PREFIX}/:annee/:siret/:etape`
export const ROUTE_PARAM_KEY_ANNEE = 'annee'
export const ROUTE_PARAM_KEY_SIRET = 'siret'
export const ROUTE_PARAM_KEY_ETAPE = 'etape'

export const ROUTE_QUERY_PARAM_KEY_IDGRAPHE = 'id_graphe'

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor() { }

  external_url_consultation(annee: Annee, siret: Siret, etape: EtapeBudgetaire) {
    let mod_prefix = ROUTE_PREFIX_MODULE
    let consultation_prefix = ROUTE_CONSULTATION_PREFIX
    return `${mod_prefix}/${consultation_prefix}/${annee}/${siret}/${etape}`
  }

  external_url_consultation_grapheId(annee: Annee, siret: Siret, etape: EtapeBudgetaire, graphe_id: VisualisationGraphId) {
    let mod_prefix = ROUTE_PREFIX_MODULE
    let consultation_prefix = ROUTE_CONSULTATION_PREFIX
    let paramKey = ROUTE_QUERY_PARAM_KEY_IDGRAPHE
    return `${mod_prefix}/${consultation_prefix}/${annee}/${siret}/${etape}?${paramKey}=${graphe_id}`
  }
}
