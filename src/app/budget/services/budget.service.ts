import { HttpClient } from "@angular/common/http";
import { Injectable, InjectionToken } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { tap, map, delay } from "rxjs/operators";
import { SettingsService } from "src/environments/settings.service";
import { Pdc } from "../models/plan-de-comptes";
import { DonneesBudget } from "../store/states/budget.state";

export enum EtapeBudgetaire {

  BUDGET_PRIMITIF = "primitif",
  BUDGET_SUPPLEMENTAIRE = "supplémentaire",
  DECISION_MODIFICATIVE = "modificative",
  COMPTE_ADMINISTRATIF = "administratif",
}

export class EtapeBudgetaireUtil {

  public static hasValue(v: string) {
    return Object.values(EtapeBudgetaire).includes(v as EtapeBudgetaire);
  }

  public static fromApi(etape_api: string): EtapeBudgetaire {
    switch (etape_api) {
      case "budget primitif":
        return EtapeBudgetaire.BUDGET_PRIMITIF;
      case "budget supplémentaire":
        return EtapeBudgetaire.BUDGET_SUPPLEMENTAIRE;
      case "décision modificative":
        return EtapeBudgetaire.DECISION_MODIFICATIVE;
      case "compte administratif":
        return EtapeBudgetaire.COMPTE_ADMINISTRATIF;
      default:
        throw new Error(`${etape_api} n'est pas une étape valide`)
    }
  }
}

export interface BudgetService {

  anneesDisponibles(siren: string): Observable<number[]>
  loadBudgets(siren: string, etape: string, annee: number): Observable<DonneesBudget>
  loadInformationsPdc(siren: string, annee: number): Observable<Pdc.InformationPdc>
}

@Injectable()
export class RealBudgetService implements BudgetService {

  private _base_url: string

  constructor(
    private http: HttpClient,
    private settings: SettingsService,
  ) {
    this._base_url = `${this.settings.settings.api.url}/api/v1/budgets`
  }

  anneesDisponibles(siren: string): Observable<number[]> {

    this._debug(`Cherche les années ou des données budget sont disponibles pour le siren ${siren}`);
    this.checkSiren(siren);

    const url = `${this._base_url}/${siren}/annees_disponibles`;
    // return this.http.get<number[]>(url)

    // TODO: se débarrasser de la verrue asap
    let verrueAnnee = new BehaviorSubject([2021]).pipe(delay(1000))
    return verrueAnnee;
  }

  loadBudgets(siren: string, etape: EtapeBudgetaire, annee: number): Observable<DonneesBudget> {

    this._debug(`Charge les données budgetaires pour le siren ${siren}, l'étape ${etape} et l'année ${annee}`);
    this.checkSiren(siren);

    const url = `${this._base_url}/${siren}/${annee}/${etape}`;
    let donnees =
      this.http.get<DonneesBudget>(url).pipe(
        map(donnees => {
          let etape_str = donnees.etape as string;
          let etape = EtapeBudgetaireUtil.fromApi(etape_str);
          donnees.etape = etape;
          return donnees;
        })
      );
    return donnees;
  }

  loadInformationsPdc(siren: string, annee: number): Observable<Pdc.InformationPdc> {

    this._debug(`Charge les informations du plan de compte pour le siren ${siren} et l'année ${annee}`)
    this.checkSiren(siren)

    const url = `${this._base_url}/${siren}/${annee}/pdc`;
    let informationsPdc = 
      this.http.get<Pdc.InformationPdc>(url).pipe(
        map(informations => {
          informations.siren = siren;
          informations.annee = annee;
          return informations;
        })
      );

    return informationsPdc;
  }

  private checkSiren(siren: string) {
    if (!siren)
      throw new Error('Le siren est nul');
  }

  private _debug(msg: string) {
    console.debug(`[${RealBudgetService.name}] ${msg}`)
  }
}

export const BUDGET_SERVICE_TOKEN = new InjectionToken<BudgetService>('BudgetService');
