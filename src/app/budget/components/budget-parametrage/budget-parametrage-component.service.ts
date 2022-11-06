import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { GlobalState, selectAuthState } from 'src/app/store/states/global.state';
import { Annee, Siren } from '../../models/donnees-budgetaires-disponibles';
import { EtablissementComboItemViewModel, EtapeComboItemViewModel } from '../../models/view-models';
import { EtapeBudgetaire } from '../../services/budget.service';
import { BudgetDisponiblesLoadingAction } from '../../store/actions/budget.actions';
import { BudgetViewModelSelectors } from '../../store/selectors/BudgetViewModelSelectors';
import { BudgetState } from '../../store/states/budget.state';


interface _NavigationParams {
  etab: string | null,
  annee: string | null,
  etape: EtapeBudgetaire | null,
}

@Injectable()
export class BudgetParametrageComponentService {

  readonly user$: Observable<User>;
  readonly siren$: Observable<string>;

  readonly navigation: Navigation;
  readonly navigationFormulaireService: NavigationFormulaireService;

  constructor(
    private globalStore: Store<GlobalState>,
    private budgetStore: Store<BudgetState>,
  ) {

    this.user$ = this.globalStore.select(selectAuthState)
      .pipe(
        map(state => state.user)
      );

    this.siren$ = this.user$
      .pipe(
        map(user => user.siren),
      );

    this.navigation = new Navigation();
    this.navigationFormulaireService = new NavigationFormulaireService(this.siren$, this.navigation, this.budgetStore);

    this.siren$.subscribe(siren => this.budgetStore.dispatch(new BudgetDisponiblesLoadingAction(siren)))
  }

  debug(_) {
    // console.debug(`[BudgetParametrageComponentService] ${msg}`);
  }
}

export class Navigation {

  get anneeSelectionnee$() {
    return this._distinctAnneeSelectionee
  }
  get etapeBudgetaireSelectionnee$() {
    return this._distinctEtapeBudgetaireSelectionnee
  }
  get etablissementSelectionnee$() {
    return this._distinctSiretSelectionnee
  }

  readonly navigationParams$: Observable<_NavigationParams>;

  private _anneeSelectionnee: Subject<string> = new ReplaySubject(1);
  private _distinctAnneeSelectionee = this._anneeSelectionnee.pipe(distinctUntilChanged());

  private _etapeBudgetaireSelectionnee: Subject<EtapeBudgetaire> = new ReplaySubject(1);
  private _distinctEtapeBudgetaireSelectionnee = this._etapeBudgetaireSelectionnee.pipe(distinctUntilChanged());

  private _siretSelectionnee: Subject<string> = new ReplaySubject(1);
  private _distinctSiretSelectionnee = this._siretSelectionnee.pipe(distinctUntilChanged())

  constructor() {
    this.navigationParams$ = combineLatest(
      [
        this.anneeSelectionnee$.pipe(startWith(null)),
        this.etablissementSelectionnee$.pipe(startWith(null)),
        this.etapeBudgetaireSelectionnee$.pipe(startWith(null)),
      ]
    ).pipe(
      map(([annee, etab, etape]) => {
        return { annee: annee, etab: etab, etape: etape } as _NavigationParams
      }),
    )

    // Debug 
    // this.etablissementSelectionnee$.subscribe(etab => this._debug(`emet etab: ${etab}`))
    // this.etapeBudgetaireSelectionnee$.subscribe(etape => this._debug(`emet etape: ${etape}`))
    // this.anneeSelectionnee$.subscribe(annee => this._debug(`emet annee: ${annee}`))
    //
  }

  public selectionneAnnee(annee: string) {
    this._anneeSelectionnee.next(annee);
  }

  public selectionneEtapeBudgetaire(etape: EtapeBudgetaire) {
    this._etapeBudgetaireSelectionnee.next(etape);
  }

  public selectionneEtablissement(siret: string) {
    this._siretSelectionnee.next(siret);
  }

  private _debug(msg: string) {
    console.debug(`[BudgetParametrageComponentService - Navigation] ${msg}`)
  }
}

export class NavigationFormulaireService {

  readonly anneesDisponibles$: Observable<Annee[]>;
  readonly etablissementsDisponibles$: Observable<EtablissementComboItemViewModel[]>;
  readonly etapesDisponibles$: Observable<EtapeComboItemViewModel[]>;

  constructor(
    private siren$: Observable<Siren>,
    private navigation: Navigation,
    private budgetStore: Store<BudgetState>,
  ) {

    let _siren$ = this.siren$.pipe(distinctUntilChanged())

    this.etablissementsDisponibles$ = combineLatest([_siren$, this.navigation.navigationParams$])
      .pipe(
        switchMap(([siren, navigation]) => this.budgetStore.select(
          BudgetViewModelSelectors.DonneesDisponibles.etablissementsDisponiblesComboViewModel(siren, navigation.annee)
        ))
      )

    /* */
    this.etapesDisponibles$ = combineLatest([_siren$, this.navigation.navigationParams$])
      .pipe(
        // tap(([_0, _1]) => this.debug(`Charge les etapes disponibles`)),
        switchMap(([siren, navigation]) =>
          this.budgetStore.select(BudgetViewModelSelectors.DonneesDisponibles.etapesDisponiblesComboViewModel(siren, navigation.annee, navigation.etab))
        )
      )
    /* */
    this.anneesDisponibles$ = _siren$
      .pipe(
        switchMap(siren => this.budgetStore.select(
          BudgetViewModelSelectors.DonneesDisponibles.anneesDisponibles(siren))
        )
      );

    // Debug
    // this.etablissementsDisponibles$.subscribe(disp => this.debug(`Emet ${disp.length} etablissements disponibles`))
    // this.etapesDisponibles$.subscribe(etapes => {
    //   let enabledEtapes = etapes.filter(e => !e.disabled)
    //   this.debug(`Emet ${etapes.length} etapes avec ${enabledEtapes.length} d'actives`)
    // });
    //
  }

  debug(msg) {
    console.debug(`[NavigationFormulaireService] ${msg}`);
  }
}