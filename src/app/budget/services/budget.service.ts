import { HttpClient } from "@angular/common/http";
import { Injectable, InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SettingsService } from "src/environments/settings.service";
import { DonneesBudgetairesDisponibles } from "../models/donnees-budgetaires-disponibles";
import { Pdc } from "../models/plan-de-comptes";
import { DonneesBudgetaires } from "../store/states/budget.state";

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

  loadInformationPdc(annee: string, siret: string): Observable<Pdc.InformationPdc>
  loadBudgets(annee: string, siret: string, etape: string): Observable<DonneesBudgetaires>
  donneesBudgetairesDisponibles(siren: string): Observable<DonneesBudgetairesDisponibles>
}

@Injectable()
export class RealBudgetService implements BudgetService {

  constructor(
    private http: HttpClient,
    private settings: SettingsService,
  ) { }

  donneesBudgetairesDisponibles(siren: string): Observable<DonneesBudgetairesDisponibles> {
    this._debug(`Cherche les données budgetaires disponibles pour le siren ${siren}`)

    const url = `${this._getBudgetBaseUrl()}/donnees_budgetaires_disponibles/${siren}`
    return this.http.get<DonneesBudgetairesDisponibles>(url)
  }

  loadInformationPdc(annee: string, siret: string): Observable<Pdc.InformationPdc> {
      
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

  loadBudgets(annee: string, siret: string, etape: string): Observable<DonneesBudgetaires> {
      
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
    return `${this.settings.settings.api.url}/budgets/api/v1`
  }
}

export const BUDGET_SERVICE_TOKEN = new InjectionToken<BudgetService>('BudgetService');
// 