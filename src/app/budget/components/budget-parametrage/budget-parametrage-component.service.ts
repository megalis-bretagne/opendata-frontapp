import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { GlobalState, selectAuthState } from 'src/app/store/states/global.state';
import { Annee, Siret } from '../../models/common-types';
import { EtapeBudgetaire } from '../../models/etape-budgetaire';
import { BudgetsStoresService } from '../../services/budgets-store.service';
import { VisualisationComponent } from '../visualisations/visualisation.component';
import { NavigationFormulaireService } from './navigation-formulaire-service';

@Injectable()
export class BudgetParametrageComponentService {

  readonly user$: Observable<User>;
  readonly siren$: Observable<string>;

  readonly navigation: Navigation;
  readonly navigationFormulaireService: NavigationFormulaireService;

  private _graphe_exporters: VisualisationComponent[] = []

  constructor(
    private globalStore: Store<GlobalState>,
    private budgetStoresServices: BudgetsStoresService,
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
      this.budgetStoresServices,
    );
  }

  get graphe_exporters() { return this._graphe_exporters }

  register_graphe_exporter(visualisation_component: VisualisationComponent) {
    this._graphe_exporters.push(visualisation_component)
  }

  unregister_graphe_exporter(visualisation_component: VisualisationComponent) {
    let index = this._graphe_exporters.indexOf(visualisation_component)
    if (index > -1) this._graphe_exporters.splice(index, 1)
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
