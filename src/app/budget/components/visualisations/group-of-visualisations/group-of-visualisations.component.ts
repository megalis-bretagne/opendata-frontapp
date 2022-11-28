import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, filter, combineLatestWith, map } from 'rxjs/operators';
import { DonneesBudgetaires } from 'src/app/budget/models/donnees-budgetaires';
import { EtapeBudgetaire } from 'src/app/budget/models/etape-budgetaire';
import { Pdc } from 'src/app/budget/models/plan-de-comptes';
import { IdentifiantVisualisation, VisualisationUtils } from 'src/app/budget/models/visualisation.model';
import { BudgetsStoresService } from 'src/app/budget/services/budgets-store.service';
import { RoutingService } from 'src/app/budget/services/routing.service';

interface _DonneesVisualisation extends IdentifiantVisualisation {
  donnees_budgetaires?: DonneesBudgetaires
  informations_pdc?: Pdc.InformationsPdc
  nom_etablissement?: string
}

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

  @Input() parametrable: boolean = false

  public visualisations: _DonneesVisualisation[] = []

  constructor(
    private storesServices: BudgetsStoresService,
    private routingService: RoutingService,
  ) { }

  ngOnInit(): void { }

  titre_pour(visualisation: _DonneesVisualisation) {
    let annee = visualisation.annee
    let nom_etab = visualisation.nom_etablissement
    let suffixe_etape = this._suffixe_nom_budget_pour(visualisation)
    switch(visualisation.graphe_id) {
      case 'budget-principal-depenses':
        return `${nom_etab} - Les dépenses ${annee} ${suffixe_etape}`
      case 'budget-principal-recettes':
        return `${nom_etab} - Les recettes ${annee} ${suffixe_etape}`
      case 'top-3-depenses':
        return `${nom_etab} - Le top 3 des dépenses ${annee} ${suffixe_etape}`
    }
  }

  description_pour(visualisation: _DonneesVisualisation) {
    return this.titre_pour(visualisation)
  }

  _suffixe_nom_budget_pour(visualisation: _DonneesVisualisation) {
    switch (visualisation.etape) {
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

    this.visualisations = visualisations
  }

  url_consultation(id_visualisation: IdentifiantVisualisation) {
    return this.routingService.external_url_consultation_grapheId(
      id_visualisation.annee,
      id_visualisation.siret,
      id_visualisation.etape,
      id_visualisation.graphe_id,
    )
  }

  // Plumbing
  is_loading$(visualisation: IdentifiantVisualisation) {
    return this.storesServices.viewModels.select_is_budget_loading(
      visualisation.annee,
      visualisation.siret,
      visualisation.etape
    )
  }

  is_in_error$(visualisation: IdentifiantVisualisation) {
    return this.storesServices.viewModels.select_is_budget_in_error(
      visualisation.annee,
      visualisation.siret,
      visualisation.etape
    )
  }

  is_successfully_loaded$(visualisation) {
    return this.is_loading$(visualisation)
      .pipe(
        combineLatestWith(this.is_in_error$(visualisation)),
        map(([loading, inError]) => !loading && !inError)
      )
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
  ): _DonneesVisualisation {
    return {
      annee: id.annee,
      siret: id.siret,
      etape: id.etape,
      graphe_id: id.graphe_id,

      donnees_budgetaires,
      informations_pdc,
      nom_etablissement,
    }
  }
}
