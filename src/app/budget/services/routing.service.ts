import { Injectable } from '@angular/core';

export const ROUTE_CONSULTATION_PREFIX = 'public/'
export const ROUTE_CONSULTATION_PATH = `${ROUTE_CONSULTATION_PREFIX}/:annee/:siret/:etape`
export const ROUTE_PARAM_KEY_ANNEE = 'annee'
export const ROUTE_PARAM_KEY_SIRET = 'siret'
export const ROUTE_PARAM_KEY_ETAPE = 'etape'

export const ROUTE_QUERY_PARAM_KEY_VISPAGE = 'vis_page'
export const ROUTE_QUERY_PARAM_KEY_IDGRAPHE = 'id_graphe'

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor() { }
}
