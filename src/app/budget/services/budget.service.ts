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

  loadInformationPdc(annee: Annee, siret: Siret): Observable<Pdc.InformationsPdc>
  loadBudgets(annee: Annee, siret: Siret, etape: EtapeBudgetaire): Observable<DonneesBudgetaires>
  donneesBudgetairesDisponibles(siren: Siren): Observable<DonneesBudgetairesDisponibles>
}

@Injectable()
export class RealBudgetService implements BudgetService {

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService,
  ) { }

  get etapes_a_garder(): EtapeBudgetaire[] {
    return this.settingsService.budgets_etapes_a_afficher as EtapeBudgetaire[]
  }

  donneesBudgetairesDisponibles(siren: Siren): Observable<DonneesBudgetairesDisponibles> {
    this._debug(`Cherche les données budgetaires disponibles pour le siren ${siren}`)

    const url = `${this._getBudgetBaseUrl()}/donnees_budgetaires_disponibles/${siren}`
    return this.http.get<DonneesBudgetairesDisponibles>(url)
      .pipe(
        map(map_donnees_budgetaires_disponibles_from_wire),
        map(donnees => keep_only_etape_from_donnees_disponibles(donnees, this.etapes_a_garder)),
        catchError(err => this.log_and_rethrow(err, `Erreur lors de la récupération/traitement des données budgetaires disponibles (siren: ${siren}):`)),
      )
  }

  loadInformationPdc(annee: Annee, siret: Siret): Observable<Pdc.InformationsPdc> {

    this._debug(`Charge les informations du plan de compte pour l'année ${annee} et le siret ${siret}`)

    const url = `${this._getBudgetBaseUrl()}/plans_de_comptes/${annee}/${siret}`;
    let informationsPdc =
      this.http.get<Pdc.InformationsPdc>(url).pipe(
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
    return `${this.settingsService.settings.api.url}/mq_apis/budgets/v1`
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

function keep_only_etape_from_donnees_disponibles(donnees_disponibles: DonneesBudgetairesDisponibles, etapes_a_garder: EtapeBudgetaire[]): DonneesBudgetairesDisponibles {

  console.debug(`Exclusion des étapes budgetaires mis à part les étapes ${etapes_a_garder} au sein des ressources disponibles`);
  let new_ressources_disponibles: RessourcesDisponiblesParAnnees = {}

  let ressources_disponibles = donnees_disponibles.ressources_disponibles

  for (const annee in ressources_disponibles) {

    let res_x_annee = {}

    for (const siret in ressources_disponibles[annee]) {
      let curr_etapes = ressources_disponibles[annee][siret]

      let n_etapes = []

      for (let etape_a_garder of etapes_a_garder) {
        if (curr_etapes.includes(etape_a_garder))
          n_etapes = [...n_etapes, etape_a_garder]
      }

      if (n_etapes.length > 0)
        res_x_annee[siret] = n_etapes
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