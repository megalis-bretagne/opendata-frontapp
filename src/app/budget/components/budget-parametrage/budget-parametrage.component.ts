import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { mergeMap, takeUntil, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { Annee, Siret } from '../../models/common-types';
import { DonneesBudgetaires } from '../../models/donnees-budgetaires';
import { EtapeBudgetaire } from '../../models/etape-budgetaire';
import { Pdc } from '../../models/plan-de-comptes';
import { IdentifiantVisualisation, VisualisationGraphId } from '../../models/visualisation.model';
import { BudgetDisponiblesLoadingAction, BudgetLoadingAction } from '../../store/actions/budget.actions';
import { BudgetViewModelSelectors } from '../../store/selectors/BudgetViewModelSelectors';
import { BudgetState, selectDonnees, selectBudgetError, selectInformationsPlanDeCompte } from '../../store/states/budget.state';
import { BudgetParametrageComponentService } from './budget-parametrage-component.service';

export const parametrage_graphes_id: VisualisationGraphId[] = [
    'budget-principal-depenses',
    'budget-principal-recettes',
    'budget-principal-top-3',
]

@Component({
  selector: 'app-budget-parametrage',
  templateUrl: './budget-parametrage.component.html',
  styleUrls: ['./budget-parametrage.component.css'],
  providers: [BudgetParametrageComponentService],
})
export class BudgetParametrageComponent implements OnInit, OnDestroy {

  user$: Observable<User>;
  siren$: Observable<string>;

  etablissementPrettyName: string = ''
  donneesBudget: DonneesBudgetaires
  informationsPlanDeCompte: Pdc.InformationPdc

  errorInLoadingBudget$;

  id_visualisations: IdentifiantVisualisation[] = []

  iframeFragment = '';

  private _snapshot_annee?: Annee
  private _snapshot_siret?: Siret
  private _snapshot_etape?: EtapeBudgetaire

  private _stop$: Subject<void> = new Subject<void>();

  constructor(
    private store: Store<BudgetState>,
    private componentService: BudgetParametrageComponentService,
    private location: Location,
    private router: Router,
  ) {

    this.user$ = this.componentService.user$;
    this.siren$ = this.componentService.siren$;
    this.errorInLoadingBudget$ = this.store.select(selectBudgetError)
  }

  ngOnInit(): void {

    let navigationParamsObs = combineLatest([
      this.componentService.navigation.anneeSelectionnee$,
      this.componentService.navigation.etablissementSelectionnee$,
      this.componentService.navigation.etapeBudgetaireSelectionnee$,
    ])

    this.siren$
      .pipe(
        tap(siren => this.store.dispatch(new BudgetDisponiblesLoadingAction(siren))),
        takeUntil(this._stop$),
      ).subscribe()

    navigationParamsObs
      .pipe(
        tap(([annee, siret, etape]) => {
          this.store.dispatch(new BudgetLoadingAction(annee, siret, etape));
          this._snapshot_annee = annee
          this._snapshot_siret = siret
          this._snapshot_etape = etape

          this.id_visualisations = []
          for (const graphe_id of parametrage_graphes_id) {
            this.id_visualisations.push(
              { annee, siret, etape, graphe_id }
            )
          }

          this.iframeFragment = this.compute_iframe_fragment(annee, siret, etape);
        }),

        mergeMap(([annee, siret, etape]) => {
          return combineLatest([
            this.store.select(selectDonnees(annee, siret, etape)),
            this.store.select(selectInformationsPlanDeCompte(annee, siret)),
            this.store.select(BudgetViewModelSelectors.DonneesDisponibles.etablissementPrettyname(siret))
          ])
        }),

        tap(([donnees, informationPdc, prettyName]) => {
          this.donneesBudget = donnees
          this.informationsPlanDeCompte = informationPdc;
          this.etablissementPrettyName = prettyName;
        }),
        takeUntil(this._stop$)
      )
      .subscribe()
  }

  compute_iframe_fragment(annee, siret, etape) {

    let path = this.compute_consultation_url(annee, siret, etape)
    let url = new URL(path, location.origin)
    return `
      <iframe referrerpolicy="strict-origin-when-cross-origin" style="border: 0;" src="${url.href}" 
       title="Marque blanche budgets" width="100%" height="600">
      </iframe>
    `;
  }

  navigate_vers_consultation_url() {

    let annee = this._snapshot_annee
    let siret = this._snapshot_siret
    let etape = this._snapshot_etape
    let path = this.compute_consultation_url(annee, siret, etape)
    this.router.navigateByUrl(path)
  }

  compute_consultation_url(annee, siret, etape) {
    let path = this.location.prepareExternalUrl(`/budget/public/${annee}/${siret}/${etape}`)
    return path
  }

  onEnregistrerClic() {
    // TODO: impl
  }

  onTelechargerPdfClic() {
    // TODO impl
  }

  onCopierIframeClic() {
    // TODO impl
  }

  ngOnDestroy(): void {
    this._stop$.next();
    this._stop$.complete();
  }
}
