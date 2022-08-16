import { HttpClient } from "@angular/common/http";
import { Injectable, InjectionToken } from "@angular/core";
import { Observable, from } from "rxjs";
import { switchMap } from "rxjs/operators";
import { SettingsService } from "src/environments/settings.service";
import { LigneBudget } from "../store/states/budget.state";

/**
 * Etape budgetaire tel que décrit ici:
 * https://schema.data.gouv.fr/scdl/budget/0.8.1/documentation.html#etape-budgetaire-propriete-bgt-natdec
 */
export enum EtapeBudgetaire {

  BUDGET_PRIMITIF,
  BUDGET_SUPPLEMENTAIRE,
  DECISION_MODIFICATIVE,
  COMPTE_ADMINISTRATIF,
}

export interface BudgetService {

  anneesDisponibles(siren: string): Observable<number[]>
  loadBudgets(siren: string, annee: number): Observable<LigneBudget>
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
    return this.http.get<number[]>(url)
  }

  loadBudgets(siren: string, annee: number): Observable<LigneBudget> {

    this._debug(`Charge les lignes budgetaires pour le siren ${siren} et l'année ${annee}`);
    this.checkSiren(siren);

    const url = `${this._base_url}/${siren}/${annee}`;
    let lignes = this.http.get<LigneBudget[]>(url)
      .pipe(
        switchMap(lignes => from(lignes))
      )
    return lignes;
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
