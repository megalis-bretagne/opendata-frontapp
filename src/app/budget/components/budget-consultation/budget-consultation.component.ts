import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Pdc } from '../../models/plan-de-comptes';

import { DonneesBudgetaires } from '../../models/donnees-budgetaires';
import { Annee, extract_siren, Siret } from '../../models/common-types';
import { IdentifiantVisualisation, PagesDeVisualisations, VisualisationGraphId } from '../../models/visualisation.model';
import { EtapeBudgetaire } from '../../models/etape-budgetaire';
import { ROUTE_PARAM_KEY_ANNEE, ROUTE_PARAM_KEY_ETAPE, ROUTE_PARAM_KEY_SIRET, ROUTE_QUERY_PARAM_KEY_IDGRAPHE } from '../../services/routing.service';
import { BudgetsStoresService } from '../../services/budgets-store.service';

@Component({
  selector: 'app-budget-consultation',
  templateUrl: './budget-consultation.component.html',
  styleUrls: ['./budget-consultation.component.css']
})
export class BudgetConsultationComponent implements OnInit {

  siret: Siret
  annee: Annee;
  etape: EtapeBudgetaire;

  etablissementPrettyname: string;
  donneesBudget: DonneesBudgetaires;
  informationsPdc: Pdc.InformationsPdc;

  private _stop$: Subject<void> = new Subject<void>();
  id_visualisations: IdentifiantVisualisation[];

  get affiche_en_construction() {
    return this.etape == EtapeBudgetaire.DECISION_MODIFICATIVE
  }

  constructor(
    private route: ActivatedRoute,
    private budgetsStoresService: BudgetsStoresService) { }

  ngOnInit(): void {
    this.annee = this.route.snapshot.params[ROUTE_PARAM_KEY_ANNEE];
    this.siret = this.route.snapshot.params[ROUTE_PARAM_KEY_SIRET];
    this.etape = this.route.snapshot.params[ROUTE_PARAM_KEY_ETAPE];

    let graph_id_param = this.route.snapshot.queryParamMap.get(ROUTE_QUERY_PARAM_KEY_IDGRAPHE) as VisualisationGraphId

    let graphesIds = (graph_id_param) ?
      [graph_id_param] :
      PagesDeVisualisations.visualisations_pour_route(this.annee, this.siret, this.etape)

    let siren = extract_siren(this.siret)

    this.id_visualisations = this.retrieve_visualisations(graphesIds)

    this.budgetsStoresService.load_budgets_disponibles_pour(siren)
    this.budgetsStoresService.viewModels.select_etablissement_pretty_name(this.siret)
      .pipe(
        tap(prettyName => this.etablissementPrettyname = prettyName),
        takeUntil(this._stop$)
      )
      .subscribe()

    this.budgetsStoresService.viewModels
      .select_budget(this.annee, this.siret, this.etape)
      .pipe(takeUntil(this._stop$))
      .subscribe(([donnees, pdc]) => {
        this.donneesBudget = donnees
        this.informationsPdc = pdc
      });
  }

  retrieve_visualisations(grapheIds: VisualisationGraphId[]): IdentifiantVisualisation[] {

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
