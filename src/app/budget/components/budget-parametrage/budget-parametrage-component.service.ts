import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { GlobalState, selectAuthState } from 'src/app/store/states/global.state';
import { SettingsService } from 'src/environments/settings.service';
import { Annee, Siret } from '../../models/common-types';
import { EtapeBudgetaire } from '../../models/etape-budgetaire';
import { VisualisationGraphId } from '../../models/visualisation.model';
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
    private settingsService: SettingsService,
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
      this.settingsService,
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

  editeGrapheTitres(grapheId: VisualisationGraphId, titre: string, sous_titre: string) {

    let annee = this.navigation.anneeSelectionnee
    let siret = this.navigation.etablissementSelectionne
    let etape = this.navigation.etapeBudgetaireSelectionnee

    this.budgetStoresServices.edit_defaultvisualisation_titres_pour(
      annee, siret, etape, grapheId, titre, sous_titre
    )
  }

  destroy() {
    this.navigation.destroy()
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

  anneeSelectionnee?: Annee
  etapeBudgetaireSelectionnee?: EtapeBudgetaire
  etablissementSelectionne?: Siret

  _stop$ = new Subject<void>()

  constructor() {

    this.etablissementSelectionnee$
      .pipe(takeUntil(this._stop$))
      .subscribe(etab => this.etablissementSelectionne = etab)
    this.etapeBudgetaireSelectionnee$
      .pipe(takeUntil(this._stop$))
      .subscribe(etape => this.etapeBudgetaireSelectionnee = etape)
    this.anneeSelectionnee$
      .pipe(takeUntil(this._stop$))
      .subscribe(annee => this.anneeSelectionnee = annee)
  }

  destroy() {
    this._stop$.next()
    this._stop$.complete()
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
