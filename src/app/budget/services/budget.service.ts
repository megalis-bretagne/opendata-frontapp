import { HttpClient } from "@angular/common/http";
import { Injectable, InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SettingsService } from "src/environments/settings.service";
import { DonneesBudgetairesDisponibles } from "../models/donnees-budgetaires-disponibles";
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
        map(map_donnees_budgetaires_disponibles_from_wire)
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
        })
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
        })
      );
    return donnees;
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