import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, ReplaySubject, Subject } from 'rxjs';
import { map, mergeMap, startWith, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { GlobalState, selectAuthState } from 'src/app/store/states/global.state';
import { EtablissementComboItemViewModel, EtapeComboItemViewModel } from '../../models/view-models';
import { EtapeBudgetaire } from '../../services/budget.service';
import { BudgetDisponiblesLoadingAction } from '../../store/actions/budget.actions';
import { BudgetViewModelSelectors } from '../../store/selectors/BudgetViewModelSelectors';
import { BudgetState } from '../../store/states/budget.state';


export enum PresentationType {
  SIMPLIFIE,
  AVANCEE,
  PAR_HABITANT,
  PAR_EURO,
}

export interface NavigationParams {
  etab: string | null,
  annee: string | null,
  etape: EtapeBudgetaire | null,
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

    this.etablissementsDisponibles$ = combineLatest([this.siren$, this.navigation.navigationParams$])
      .pipe(
        mergeMap(([siren, navigation]) => this.budgetStore.select(
          BudgetViewModelSelectors.DonneesDisponibles.etablissementsDisponiblesComboViewModel(siren, navigation.annee)
          )),
        tap(etablissementsDisponibles => this.etablissementsDisponiblesSnapshot = etablissementsDisponibles)
      )

    /* */
    this.etapesDisponibles$ = combineLatest([this.siren$, this.navigation.navigationParams$])
      .pipe(
        // tap(([_0, _1]) => this.debug(`Charge les etapes disponibles`)),
        mergeMap(([siren, navigation]) => 
          this.budgetStore.select(BudgetViewModelSelectors.DonneesDisponibles.etapesDisponiblesComboViewModel(siren, navigation.annee, navigation.etab))
        ),
        tap(etapes => this.etapesDisponiblesSnapshot = etapes),
      )
    /* */
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

  readonly navigationParams$: Observable<NavigationParams>;

  private _anneeSelectionnee: Subject<string> = new ReplaySubject(1);
  private _etapeBudgetaireSelectionnee: Subject<EtapeBudgetaire> = new ReplaySubject(1);
  private _presentationSelectionnee: Subject<PresentationType> = new ReplaySubject(1);
  private _siretSelectionnee: Subject<string> = new ReplaySubject(1);

  constructor() {
    this.anneeSelectionnee$ = this._anneeSelectionnee;
    this.etapeBudgetaireSelectionnee$ = this._etapeBudgetaireSelectionnee;
    this.presentationSelectionnee$ = this._presentationSelectionnee;
    this.etablissementSelectionnee$ = this._siretSelectionnee;

    this.navigationParams$ = combineLatest(
      [
        this.anneeSelectionnee$.pipe(startWith(null)),
        this.etablissementSelectionnee$.pipe(startWith(null)),
        this.etapeBudgetaireSelectionnee$.pipe(startWith(null)),
      ]
    ).pipe(
      map(([annee, etab, etape]) => { 
        return { annee: annee, etab: etab, etape: etape } as NavigationParams
      }),
    )
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
