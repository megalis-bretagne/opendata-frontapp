import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { GlobalState, selectAuthState } from 'src/app/store/states/global.state';
import { _Etablissement } from '../../models/donnees-budgetaires-disponibles';
import { EtablissementComboItemViewModel, EtapeComboItemViewModel } from '../../models/view-models';
import { EtapeBudgetaire } from '../../services/budget.service';
import { BudgetDisponiblesLoadingAction } from '../../store/actions/budget.actions';
import { BudgetViewModelSelectors, etape_vers_comboViewModel } from '../../store/selectors/BudgetViewModelSelectors';
import { BudgetState } from '../../store/states/budget.state';


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

  readonly anneesDisponibles$: Observable<string[]>;
  anneesDisponiblesSnapshot: string[];

  readonly etablissementsDisponibles$: Observable<EtablissementComboItemViewModel[]>;
  etablissementsDisponiblesSnapshot: EtablissementComboItemViewModel[];

  readonly etapesDisponibles$: Observable<EtapeComboItemViewModel[]>;
  etapesDisponiblesSnapshot: EtapeComboItemViewModel[];

  readonly navigation: Navigation;

  constructor(
    private globalStore: Store<GlobalState>,
    private budgetStore: Store<BudgetState>,
  ) {

    this.navigation = new Navigation();

    this.user$ = this.globalStore.select(selectAuthState)
      .pipe(
        map(state => state.user)
      );

    this.siren$ = this.user$
      .pipe(
        map(user => user.siren),
      );

    this.siren$.subscribe(siren => this.budgetStore.dispatch(new BudgetDisponiblesLoadingAction(siren)))

    this.etablissementsDisponibles$ = this.siren$
      .pipe(
        mergeMap(siren => this.budgetStore.select(BudgetViewModelSelectors.DonneesDisponibles.etablissementsDisponiblesComboViewModel(siren))),
        tap(etablissementsDisponibles => this.etablissementsDisponiblesSnapshot = etablissementsDisponibles)
      )

    this.etapesDisponiblesSnapshot = Object.keys(EtapeBudgetaire)
      .map(k => {
        let etape = EtapeBudgetaire[k]
        return etape_vers_comboViewModel(etape)
      })
    this.etapesDisponibles$ = of(this.etapesDisponiblesSnapshot)

    this.anneesDisponibles$ = this.siren$
      .pipe(
        mergeMap(siren => this.budgetStore.select(
          BudgetViewModelSelectors.DonneesDisponibles.anneesDisponibles(siren))
        ),
        tap(annees => this.anneesDisponiblesSnapshot = annees)
      );
  }

  debug(msg) {
    console.debug(`[BudgetParametrageComponentService] ${msg}`);
  }
}

class Navigation {

  readonly anneeSelectionnee$: Observable<string>;
  readonly etapeBudgetaireSelectionnee$: Observable<EtapeBudgetaire>;
  readonly presentationSelectionnee$: Observable<PresentationType>;
  readonly etablissementSelectionnee$: Observable<string>;

  private _anneeSelectionnee: Subject<string> = new ReplaySubject(1);
  private _etapeBudgetaireSelectionnee: Subject<EtapeBudgetaire> = new ReplaySubject(1);
  private _presentationSelectionnee: Subject<PresentationType> = new ReplaySubject(1);
  private _siretSelectionnee: Subject<string> = new ReplaySubject(1);

  constructor() {
    this.anneeSelectionnee$ = this._anneeSelectionnee;
    this.etapeBudgetaireSelectionnee$ = this._etapeBudgetaireSelectionnee;
    this.presentationSelectionnee$ = this._presentationSelectionnee;
    this.etablissementSelectionnee$ = this._siretSelectionnee;
  }

  public selectionneAnnee(annee: string) {

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

  public selectionneEtablissement(siret: string) {
    this._debug(`Selectionne le siret ${siret}`)
    this._siretSelectionnee.next(siret);
  }

  private _debug(msg: string) {
    console.debug(`[BudgetParametrageComponentService - Navigation] ${msg}`)
  }
}
