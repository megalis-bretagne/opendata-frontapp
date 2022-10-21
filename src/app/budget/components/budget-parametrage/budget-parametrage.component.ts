import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { mergeMap, takeUntil, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { Pdc } from '../../models/plan-de-comptes';
import { BudgetDisponiblesLoadingAction, BudgetLoadingAction } from '../../store/actions/budget.actions';
import { BudgetViewModelSelectors } from '../../store/selectors/BudgetViewModelSelectors';
import { BudgetState, DonneesBudgetaires, selectDonnees, selectBudgetError, selectInformationsPlanDeCompte } from '../../store/states/budget.state';
import { BudgetParametrageComponentService } from './budget-parametrage-component.service';

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

  iframeFragment = '';

  private _stop$: Subject<void> = new Subject<void>();

  constructor(
    private store: Store<BudgetState>,
    private componentService: BudgetParametrageComponentService,
    private location: Location,
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

    let path = this.location.prepareExternalUrl(`/budget/public/${annee}/${siret}/${etape}`)
    let url = new URL(path, location.origin)
    return `
      <iframe referrerpolicy="strict-origin-when-cross-origin" style="border: 0;" src="${url.href}" 
       title="Marque blanche budgets" width="100%" height="600">
      </iframe>
    `;
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
