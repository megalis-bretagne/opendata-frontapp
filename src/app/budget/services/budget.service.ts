import { HttpClient } from "@angular/common/http";
import { Injectable, InjectionToken } from "@angular/core";
import { Observable, of, from } from "rxjs";
import { delay, switchMap } from "rxjs/operators";
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
export class FakeBudgetService implements BudgetService {


  constructor(private httpClient: HttpClient) {
    this._debug('Construction');
  }

  anneesDisponibles(siren: string) {
    this._debug(`Cherche les années ou des données budget sont disponibles pour le siren ${siren}`);
    this.checkSiren(siren);

    return of([2022, 2021, 2020])
      .pipe(
        delay(1000)
      );
  }

  loadBudgets(siren: string, annee: number): Observable<LigneBudget> {
    this._debug(`Charge les lignes budgetaires pour le siren ${siren} et l'année ${annee}`);
    this.checkSiren(siren);

    let lignes = this.httpClient.get<LigneBudget[]>('./assets/fake-budget.json')
      .pipe(
        delay(1000),
        switchMap(lignes => from(lignes))
      );

    return lignes;
  }

  private checkSiren(siren: string) {
    if (!siren)
      throw new Error('Le siren est nul');
  }

  private _debug(msg: string) {
    console.debug(`[${FakeBudgetService.name}] ${msg}`)
  }
}


export const BUDGET_SERVICE_TOKEN = new InjectionToken<BudgetService>('BudgetService');
