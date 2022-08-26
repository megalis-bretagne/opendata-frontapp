import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { GlobalState, selectAuthState } from 'src/app/store/states/global.state';
import { BudgetService, BUDGET_SERVICE_TOKEN, EtapeBudgetaire } from '../../services/budget.service';
import { BudgetAnneesDisponiblesLoadingAction } from '../../store/actions/budget.actions';
import { BudgetState, selectAnneesDisponibles } from '../../store/states/budget.state';

export enum PresentationType {
  SIMPLIFIE,
  AVANCEE,
  PAR_HABITANT,
  PAR_EURO,
}

@Injectable()
export class BudgetParametrageComponentService {

  readonly user$: Observable<User>;
  readonly siren$: Observable<string>;

  readonly anneesDisponibles$: Observable<number[]>;
  anneesDisponiblesSnapshot: number[];

  readonly navigation: Navigation;

  constructor(
    private globalStore: Store<GlobalState>,
    private budgetStore: Store<BudgetState>,
    @Inject(BUDGET_SERVICE_TOKEN)
    private budgetService: BudgetService,
  ) {

    this.user$ = this.globalStore.select(selectAuthState)
      .pipe(
        map(state => state.user)
      );

    this.siren$ = this.user$
      .pipe(
        map(user => user.siren),
      );

    this.siren$.subscribe(siren =>
      this.budgetStore.dispatch(new BudgetAnneesDisponiblesLoadingAction(siren))
    )

    this.anneesDisponibles$ = this.budgetStore.select(selectAnneesDisponibles)
      .pipe(
        tap(annees => this.anneesDisponiblesSnapshot = annees)
      );

    this.navigation = new Navigation(this.budgetService, this);
  }
}

class Navigation {

  readonly anneeSelectionnee$: Observable<number>;
  readonly etapeBudgetaireSelectionnee$: Observable<EtapeBudgetaire>;
  readonly presentationSelectionnee$: Observable<PresentationType>;

  private _anneeSelectionnee: Subject<number> = new ReplaySubject();
  private _etapeBudgetaireSelectionnee: Subject<EtapeBudgetaire> = new ReplaySubject();
  private _presentationSelectionnee: Subject<PresentationType> = new ReplaySubject();

  constructor(
    private budgetService: BudgetService,
    private budgetParametrageComponentService: BudgetParametrageComponentService
  ) {
    this.anneeSelectionnee$ = this._anneeSelectionnee;
    this.etapeBudgetaireSelectionnee$ = this._etapeBudgetaireSelectionnee;
    this.presentationSelectionnee$ = this._presentationSelectionnee;
  }

  public selectionneAnnee(annee: number) {

    this._debug(`Selectionne l'année ${annee}`);
    this._anneeSelectionnee.next(annee);
  }

  public selectionneEtapeBudgetaire(etape: EtapeBudgetaire) {
    this._debug(`Selectionne l'étape ${etape}`);
    this._etapeBudgetaireSelectionnee.next(etape);
  }

  public selectionnePresentation(presentation: PresentationType) {
    this._debug(`Selectionne la présentation ${PresentationType[presentation]}`);
    this._presentationSelectionnee.next(presentation);
  }

  private _debug(msg: string) {
    console.debug(`[BudgetParametrageComponentService - Navigation] ${msg}`)
  }
}
