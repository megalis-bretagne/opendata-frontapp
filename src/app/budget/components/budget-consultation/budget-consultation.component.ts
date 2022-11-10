import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Pdc } from '../../models/plan-de-comptes';
import { BudgetDisponiblesLoadingAction, BudgetLoadingAction } from '../../store/actions/budget.actions';
import { BudgetViewModelSelectors } from '../../store/selectors/BudgetViewModelSelectors';
import { BudgetState, selectDonnees as selectDonneesBudget, selectInformationsPlanDeCompte } from '../../store/states/budget.state';

import { DonneesBudgetaires } from '../../models/donnees-budgetaires';
import { Annee, extract_siren, Siret } from '../../models/common-types';
import { IdentifiantVisualisation, PagesDeVisualisations, VisualisationGraphId } from '../../models/visualisation.model';
import { EtapeBudgetaire } from '../../models/etape-budgetaire';
import { ROUTE_PARAM_KEY_ANNEE, ROUTE_PARAM_KEY_ETAPE, ROUTE_PARAM_KEY_SIRET, ROUTE_QUERY_PARAM_KEY_IDGRAPHE, ROUTE_QUERY_PARAM_KEY_VISPAGE } from '../../services/routing.service';

@Component({
  selector: 'app-budget-consultation',
  templateUrl: './budget-consultation.component.html',
  styleUrls: ['./budget-consultation.component.css']
})
export class BudgetConsultationComponent implements OnInit {

  siret: Siret
  annee: Annee;
  etape: EtapeBudgetaire;
  vis_page?: PagesDeVisualisations.PageId;
  graphe_id?: VisualisationGraphId

  etablissementPrettyname: string;
  donneesBudget: DonneesBudgetaires;
  informationsPdc: Pdc.InformationPdc;

  private _stop$: Subject<void> = new Subject<void>();
  id_visualisations: IdentifiantVisualisation[];

  constructor(private route: ActivatedRoute, private store: Store<BudgetState>) { }

  ngOnInit(): void {
    this.annee = this.route.snapshot.params[ROUTE_PARAM_KEY_ANNEE];
    this.siret = this.route.snapshot.params[ROUTE_PARAM_KEY_SIRET];
    this.etape = this.route.snapshot.params[ROUTE_PARAM_KEY_ETAPE];

    this.vis_page = this.route.snapshot.queryParamMap.get(ROUTE_QUERY_PARAM_KEY_VISPAGE) as PagesDeVisualisations.PageId;
    this.graphe_id = this.route.snapshot.queryParamMap.get(ROUTE_QUERY_PARAM_KEY_IDGRAPHE) as VisualisationGraphId;

    let siren = extract_siren(this.siret)

    this.id_visualisations = this.retrieve_visualisations()

    this.store.dispatch(new BudgetLoadingAction(this.annee, this.siret, this.etape));
    this.store.select(BudgetViewModelSelectors.DonneesDisponibles.etablissementPrettyname(this.siret))
      .pipe(
        tap(prettyName => this.etablissementPrettyname = prettyName),
        takeUntil(this._stop$)
      )
      .subscribe()

    this.store.dispatch(new BudgetDisponiblesLoadingAction(siren));
    this.store.select(selectDonneesBudget(this.annee, this.siret, this.etape))
      .pipe(
        // tap(donnees => console.info(`Donnees ${donnees}`)),
        tap(donnees => this.donneesBudget = donnees),
        takeUntil(this._stop$),
      )
      .subscribe();
    this.store.select(selectInformationsPlanDeCompte(this.annee, this.siret))
      .pipe(
        tap(infoPdc => console.info(`Informations plan de comptes ${infoPdc}`)),
        tap(infoPdc => this.informationsPdc = infoPdc),
        takeUntil(this._stop$),
      )
      .subscribe();

  }
  retrieve_visualisations(): IdentifiantVisualisation[] {

    let grapheIds = undefined
    if (this.vis_page)
      grapheIds = PagesDeVisualisations.visualisation_pour_pageid(this.vis_page)
    else if(this.graphe_id)
      grapheIds = [this.graphe_id]

    if(!grapheIds)
      grapheIds = PagesDeVisualisations.visualisation_pour_pageid('default')

    let id_visualisations = []
    for (const graphe_id of grapheIds) {
      let annee = this.annee
      let siret = this.siret
      let etape = this.etape
      id_visualisations.push(
        { annee, siret, etape, graphe_id }
      )
    }
    return id_visualisations
  }

}
