import { HttpClient } from "@angular/common/http";
import { Injectable, InjectionToken } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { tap, map, catchError } from "rxjs/operators";
import { SettingsService } from "src/environments/settings.service";
import { DonneesBudgetairesDisponibles, RessourcesDisponiblesParAnnees } from "../models/donnees-budgetaires-disponibles";
import { DonneesBudgetaires } from "../models/donnees-budgetaires";
import { Pdc } from "../models/plan-de-comptes";
import { EtapeBudgetaire, EtapeBudgetaireUtil } from "../models/etape-budgetaire";
import { Annee, Siren, Siret } from "../models/common-types";


export interface BudgetService {

  loadInformationPdc(annee: Annee, siret: Siret): Observable<Pdc.InformationPdc>
  loadBudgets(annee: Annee, siret: Siret, etape: EtapeBudgetaire): Observable<DonneesBudgetaires>
  donneesBudgetairesDisponibles(siren: Siren): Observable<DonneesBudgetairesDisponibles>
}

@Injectable()
export class RealBudgetService implements BudgetService {

  constructor(
    private http: HttpClient,
    private settings: SettingsService,
  ) { }

  donneesBudgetairesDisponibles(siren: Siren): Observable<DonneesBudgetairesDisponibles> {
    this._debug(`Cherche les données budgetaires disponibles pour le siren ${siren}`)

    const url = `${this._getBudgetBaseUrl()}/donnees_budgetaires_disponibles/${siren}`
    return this.http.get<DonneesBudgetairesDisponibles>(url)
      .pipe(
        map(map_donnees_budgetaires_disponibles_from_wire),
        map(strip_etapes_except_administratif_from_donnees_disponibles), // TODO: enlever lorsqu'on traitera autres que comptes administratifs
        catchError(err => this.log_and_rethrow(err, `Erreur lors de la récupération/traitement des données budgetaires disponibles (siren: ${siren}):`)),
      )
  }

  loadInformationPdc(annee: Annee, siret: Siret): Observable<Pdc.InformationPdc> {

    this._debug(`Charge les informations du plan de compte pour l'année ${annee} et le siret ${siret}`)

    const url = `${this._getBudgetBaseUrl()}/plans_de_comptes/${annee}/${siret}`;
    let informationsPdc =
      this.http.get<Pdc.InformationPdc>(url).pipe(
        map(informations => {
          informations.siret = siret;
          informations.annee = annee;
          return informations;
        }),
        catchError(err => this.log_and_rethrow(err, `Erreur lors de la récupération/traitement des informations PDC (annee: ${annee}, siret: ${siret}):`)),
      );

    return informationsPdc;
  }

  loadBudgets(annee: Annee, siret: Siret, etape: EtapeBudgetaire): Observable<DonneesBudgetaires> {

    this._debug(`Charge les données budgetaires pour le siret ${siret}, lors de l'année ${annee} et l'étape ${etape}`);

    const url = `${this._getBudgetBaseUrl()}/donnees_budgetaires/${annee}/${siret}/${etape}`;
    let donnees =
      this.http.get<DonneesBudgetaires>(url).pipe(
        map(donnees => {
          let etape_str = donnees.etape as string;
          let etape = EtapeBudgetaireUtil.fromApi(etape_str);
          donnees.etape = etape;
          return donnees;
        }),
        catchError(err => this.log_and_rethrow(err, `Erreur lors de la récupération/traitement des données budgetaires (annee: ${annee}, siret: ${siret}, etape: ${etape}):`)),
      );
    return donnees;
  }

  private log_and_rethrow(err: any, msg?: string) {
    let _msg = msg
    if (_msg === undefined)
      _msg = err
    this._error(_msg)
    console.error(err)
    return throwError(() => err)
  }

  private _error(msg: string) {
    console.error(`[${RealBudgetService.name}] ${msg}`)
  }

  private _debug(msg: string) {
    console.debug(`[${RealBudgetService.name}] ${msg}`)
  }

  private _getBudgetBaseUrl() {
    return `${this.settings.settings.api.url}/mq_apis/budgets/v1`
  }
}

export const BUDGET_SERVICE_TOKEN = new InjectionToken<BudgetService>('BudgetService');

export function map_donnees_budgetaires_disponibles_from_wire(wire: any): DonneesBudgetairesDisponibles {

  let t_wire = wire as DonneesBudgetairesDisponibles;

  for (let annee in t_wire.ressources_disponibles) {

    for (let etab in t_wire.ressources_disponibles[annee]) {

      // Les étapes budgetaires sont des string, on doit les transformer dans notre model
      let etapes = t_wire.ressources_disponibles[annee][etab]
      t_wire.ressources_disponibles[annee][etab] = etapes.map(e => EtapeBudgetaireUtil.fromApi(e))
    }
  }

  return t_wire;
}

function strip_etapes_except_administratif_from_donnees_disponibles(donnees_disponibles: DonneesBudgetairesDisponibles): DonneesBudgetairesDisponibles {

  console.warn(`Exclusion des étapes budgetaires mis à part l'étape administrative au sein des ressources disponibles`);
  let new_ressources_disponibles: RessourcesDisponiblesParAnnees = {}

  let ressources_disponibles = donnees_disponibles.ressources_disponibles

  for (const annee in ressources_disponibles) {

    let res_x_annee = {}

    for (const siret in ressources_disponibles[annee]) {
      let etapes = ressources_disponibles[annee][siret]

      if (etapes.includes(EtapeBudgetaire.COMPTE_ADMINISTRATIF)) {
        res_x_annee[siret] = [EtapeBudgetaire.COMPTE_ADMINISTRATIF]
      }
    }

    if (Object.keys(res_x_annee).length > 0)
      new_ressources_disponibles[annee] = res_x_annee
  }

  let donnees = {
    infos_etablissements: donnees_disponibles.infos_etablissements,
    ressources_disponibles: new_ressources_disponibles,
    siren: donnees_disponibles.siren,
  }
  return donnees
}