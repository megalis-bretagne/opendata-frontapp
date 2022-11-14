import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { DonneesBudgetaires } from 'src/app/budget/models/donnees-budgetaires';
import { Pdc } from 'src/app/budget/models/plan-de-comptes';
import { IdentifiantVisualisation, VisualisationUtils } from 'src/app/budget/models/visualisation.model';
import { RoutingService } from 'src/app/budget/services/routing.service';
import { BudgetLoadingAction } from 'src/app/budget/store/actions/budget.actions';
import { BudgetViewModelSelectors } from 'src/app/budget/store/selectors/BudgetViewModelSelectors';
import { BudgetState, selectDonnees, selectInformationsPlanDeCompte } from 'src/app/budget/store/states/budget.state';

interface _DonneesVisualisation extends IdentifiantVisualisation {
  donnees_budgetaires?: DonneesBudgetaires
  informations_pdc?: Pdc.InformationPdc
  nom_etablissement?: string
  loading: boolean
}

@Component({
  selector: 'app-group-of-visualisations',
  templateUrl: './group-of-visualisations.component.html',
  styleUrls: ['./group-of-visualisations.component.css']
})
export class GroupOfVisualisationsComponent implements OnInit, OnDestroy {

  private _stop$ = new Subject<void>()
  private _souscriptions: Subscription[] = []

  @Input()
  set id_visualisations(id_visualisations: IdentifiantVisualisation[]) {
    this._id_visualisations = id_visualisations

    this.compute_visualisations(this._id_visualisations)
  }

  @Input() parametrable: boolean = false

  public visualisations: _DonneesVisualisation[] = []

  constructor(
    private budgetStore: Store<BudgetState>,
    private routingService: RoutingService,
  ) { }

  ngOnInit(): void { }


  compute_visualisations(id_visualisations: IdentifiantVisualisation[]) {

    for (const sub of this._souscriptions)
      sub.unsubscribe()
    this._souscriptions = []

    let api_call_descs = VisualisationUtils.extract_api_call_descs(id_visualisations)
    for (const api_call_desc of api_call_descs)
      this.budgetStore.dispatch(new BudgetLoadingAction(api_call_desc.annee, api_call_desc.siret, api_call_desc.etape))

    let visualisations = []
    for (const id_vis of id_visualisations)
      visualisations.push(this.toLoadingVisualisation(id_vis))

    for (const i in id_visualisations) {
      let id_vis = id_visualisations[i]
      let annee = id_vis.annee
      let siret = id_vis.siret
      let etape = id_vis.etape

      let sub = combineLatest([
        this.budgetStore.select(selectDonnees(annee, siret, etape)),
        this.budgetStore.select(selectInformationsPlanDeCompte(annee, siret)),
        this.budgetStore.select(BudgetViewModelSelectors.DonneesDisponibles.etablissementPrettyname(siret))
      ])
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
  private _id_visualisations: IdentifiantVisualisation[]
  get id_visualisations() {
    return this._id_visualisations
  }

  ngOnDestroy(): void {
    this._stop$.next(null)
    this._stop$.complete()
  }

  toLoadingVisualisation(id: IdentifiantVisualisation): _DonneesVisualisation {
    return {
      annee: id.annee,
      siret: id.siret,
      etape: id.etape,
      graphe_id: id.graphe_id,

      loading: true,
    }
  }

  toVisualisation(
    id: IdentifiantVisualisation,
    donnees_budgetaires: DonneesBudgetaires,
    informations_pdc: Pdc.InformationPdc,
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

      loading: false,
    }
  }
}
