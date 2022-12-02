import { Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, filter, combineLatestWith, map } from 'rxjs/operators';
import { Annee } from 'src/app/budget/models/common-types';
import { DefaultVisualisationParametrage, DefaultVisualisationParametrageLocalisation } from 'src/app/budget/models/defaultvisualisation-parametrage';
import { DonneesBudgetaires } from 'src/app/budget/models/donnees-budgetaires';
import { EtapeBudgetaire } from 'src/app/budget/models/etape-budgetaire';
import { Pdc } from 'src/app/budget/models/plan-de-comptes';
import { IdentifiantVisualisation, VisualisationGraphId, VisualisationUtils } from 'src/app/budget/models/visualisation.model';
import { BudgetsStoresService } from 'src/app/budget/services/budgets-store.service';
import { RoutingService } from 'src/app/budget/services/routing.service';
import { BudgetParametrageComponentService } from '../../budget-parametrage/budget-parametrage-component.service';

import { Visualisation } from '../../../models/visualisation.model'

@Component({
  selector: 'app-group-of-visualisations',
  templateUrl: './group-of-visualisations.component.html',
  styleUrls: ['./group-of-visualisations.component.css']
})
export class GroupOfVisualisationsComponent implements OnInit, OnDestroy {

  private _stop$ = new Subject<void>()

  @Input()
  set id_visualisations(id_visualisations: IdentifiantVisualisation[]) {
    this._id_visualisations = id_visualisations

    this.compute_visualisations(this._id_visualisations)
  }

  get parametrable() {
    return Boolean(this.parametrageComponentService)
  }

  private _visualisations: IdentifiantVisualisation[] = []
  get visualisations(): Visualisation[] {
    return (this._visualisations as Visualisation[])
  }

  constructor(
    private storesServices: BudgetsStoresService,
    private routingService: RoutingService,
    @Optional()
    private parametrageComponentService?: BudgetParametrageComponentService,
  ) { }

  ngOnInit(): void { }

  compute_visualisations(id_visualisations: IdentifiantVisualisation[]) {

    let api_call_descs = VisualisationUtils.extract_api_call_descs(id_visualisations)
    for (const api_call_desc of api_call_descs)
      this.storesServices.load_budgets_pour(api_call_desc.annee, api_call_desc.siret, api_call_desc.etape)

    let visualisations = id_visualisations

    for (const i in id_visualisations) {
      let id_vis = id_visualisations[i]
      let annee = id_vis.annee
      let siret = id_vis.siret
      let etape = id_vis.etape

      this.storesServices.viewModels
        .select_budget_et_etabname(annee, siret, etape)
        .pipe(
          filter(([donnnes_budgetaires, info_pdc, nom_etab]) => Boolean(donnnes_budgetaires) && Boolean(info_pdc) && Boolean(nom_etab)),
          takeUntil(this._stop$),
        )
        .subscribe(([donnnes_budgetaires, info_pdc, nom_etab]) => {
          let vis = this.toVisualisation(
            id_vis,
            donnnes_budgetaires,
            info_pdc,
            nom_etab,
          );
          visualisations[i] = vis
        });
    }

    this._visualisations = visualisations
  }

  // Plumbing
  private _default_titre_pour(annee: Annee, nom_etablissement: string, etape: EtapeBudgetaire, graphe_id: VisualisationGraphId) {

    let suffixe_etape = this._suffixe_nom_budget_pour(etape)
    switch (graphe_id) {
      case 'donut-depenses':
        return `${nom_etablissement} - Les dépenses ${annee} ${suffixe_etape}`
      case 'donut-recettes':
        return `${nom_etablissement} - Les recettes ${annee} ${suffixe_etape}`
      case 'top-3-depenses':
        return `${nom_etablissement} - Le top 3 des dépenses ${annee} ${suffixe_etape}`
    }
  }

  private _suffixe_nom_budget_pour(etape: EtapeBudgetaire) {
    switch (etape) {
      case EtapeBudgetaire.BUDGET_PRIMITIF:
        return 'du budget primitif'
      case EtapeBudgetaire.COMPTE_ADMINISTRATIF:
        return 'du compte administratif'
      case EtapeBudgetaire.BUDGET_SUPPLEMENTAIRE:
        return 'du budget supplémentaire'
      case EtapeBudgetaire.DECISION_MODIFICATIVE:
        return 'de la décision modificative'
    }
  }

  private _id_visualisations: IdentifiantVisualisation[]
  get id_visualisations() {
    return this._id_visualisations
  }

  ngOnDestroy(): void {
    this._stop$.next(null)
    this._stop$.complete()
  }

  toVisualisation(
    id: IdentifiantVisualisation,
    donnees_budgetaires: DonneesBudgetaires,
    informations_pdc: Pdc.InformationsPdc,
    nom_etablissement: string,
  ): Visualisation {

    let annee = id.annee;
    let siret = id.siret;
    let etape = id.etape;
    let graphe_id = id.graphe_id;

    let titre = this._default_titre_pour(annee, nom_etablissement, etape, graphe_id)
    let description = this._default_titre_pour(annee, nom_etablissement, etape, graphe_id)

    return {
      annee,
      siret,
      etape,
      graphe_id,

      titre,
      description,

      donnees_budgetaires,
      informations_pdc,
      nom_etablissement,
    }
  }
}
