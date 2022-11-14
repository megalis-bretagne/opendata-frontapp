import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { GlobalState, selectAuthState } from 'src/app/store/states/global.state';
import { Annee, Siret } from '../../models/common-types';
import { EtapeBudgetaire } from '../../models/etape-budgetaire';
import { BudgetDisponiblesLoadingAction } from '../../store/actions/budget.actions';
import { BudgetState } from '../../store/states/budget.state';
import { NavigationFormulaireService } from './navigation-formulaire-service';

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
    this.navigationFormulaireService = new NavigationFormulaireService(
      this.siren$, 
      this.budgetStore,
    );

    this.siren$.subscribe(siren => this.budgetStore.dispatch(new BudgetDisponiblesLoadingAction(siren)))
  }

  destroy() {
    this.navigationFormulaireService.destroy()
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

  private _anneeSelectionnee: Subject<string> = new ReplaySubject(1);
  private _distinctAnneeSelectionee = this._anneeSelectionnee.pipe(distinctUntilChanged());

  private _etapeBudgetaireSelectionnee: Subject<EtapeBudgetaire> = new ReplaySubject(1);
  private _distinctEtapeBudgetaireSelectionnee = this._etapeBudgetaireSelectionnee.pipe(distinctUntilChanged());

  private _siretSelectionnee: Subject<string> = new ReplaySubject(1);
  private _distinctSiretSelectionnee = this._siretSelectionnee.pipe(distinctUntilChanged())

  constructor() {
    // Debug 
    // this.etablissementSelectionnee$.subscribe(etab => this._debug(`emet etab: ${etab}`))
    // this.etapeBudgetaireSelectionnee$.subscribe(etape => this._debug(`emet etape: ${etape}`))
    // this.anneeSelectionnee$.subscribe(annee => this._debug(`emet annee: ${annee}`))
    //
  }

  public selectionneAnnee(annee: Annee) {
    this._anneeSelectionnee.next(annee);
  }

  public selectionneEtapeBudgetaire(etape: EtapeBudgetaire) {
    this._etapeBudgetaireSelectionnee.next(etape);
  }

  public selectionneEtablissement(siret: Siret) {
    this._siretSelectionnee.next(siret);
  }

  private _debug(msg: string) {
    console.debug(`[BudgetParametrageComponentService - Navigation] ${msg}`)
  }
}
