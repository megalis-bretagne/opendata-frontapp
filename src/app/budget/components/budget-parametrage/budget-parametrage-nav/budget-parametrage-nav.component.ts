import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, merge, Observable, Subject } from 'rxjs';
import { first, map, takeUntil } from 'rxjs/operators';
import { EtapeBudgetaire } from 'src/app/budget/models/etape-budgetaire';
import { BudgetParametrageComponentService, Navigation } from '../budget-parametrage-component.service';
import { NavigationFormulaireService } from '../navigation-formulaire-service';
import { ANNEE_KEY, BudgetParametrageNavFormulaireModel, ETAB_KEY, ETAPE_KEY } from './budget-parametrage-nav-formulaire-model';


@Component({
  selector: 'app-budget-parametrage-nav',
  templateUrl: './budget-parametrage-nav.component.html',
  styleUrls: ['./budget-parametrage-nav.component.css']
})
export class BudgetParametrageNavComponent implements OnInit, OnDestroy {

  formulaire: BudgetParametrageNavFormulaireModel

  private _stop$ = new Subject<void>();
  private _etablissementFromRoute$: Observable<string>;
  private _anneeFromRoute$: Observable<string>;
  private _etapeFromRoute$: Observable<EtapeBudgetaire>;

  private navigation: Navigation
  private navigationFormService: NavigationFormulaireService

  constructor(
    private componentService: BudgetParametrageComponentService,
    private router: Router,
    private route: ActivatedRoute,
  ) {

    this.formulaire = new BudgetParametrageNavFormulaireModel()
    this.navigation = componentService.navigation
    this.navigationFormService = componentService.navigationFormulaireService
    this.navigationFormService.formModel = this.formulaire

    this._etablissementFromRoute$ = this.route.queryParams
      .pipe(map(params => params[ETAB_KEY]));
    this._anneeFromRoute$ = this.route.queryParams
      .pipe(
        map(params => {
          let annee = params[ANNEE_KEY]
          return annee;
        }),
      );
    this._etapeFromRoute$ = this.route.queryParams
      .pipe(map(params => params[ETAPE_KEY] as EtapeBudgetaire));

    this.formulaire.annee$
      .pipe(takeUntil(this._stop$))
      .subscribe(a => this.navigation.selectionneAnnee(a))
    this.formulaire.etape$
      .pipe(takeUntil(this._stop$))
      .subscribe(e => this.navigation.selectionneEtapeBudgetaire(e))
    this.formulaire.etablissement$
      .pipe(takeUntil(this._stop$))
      .subscribe(e => this.navigation.selectionneEtablissement(e))
  }

  ngOnInit(): void {
    this.navigationFormService.initialized$
      .pipe(takeUntil(this._stop$))
      .subscribe(() => this.setup_navigation_and_queryParams())
  }

  setup_navigation_and_queryParams() {
    /*
     Positionne les options de navigation selon les queryParams ou le component service.
     */
    let fromRoute$ = combineLatest([this._anneeFromRoute$, this._etablissementFromRoute$, this._etapeFromRoute$])
    fromRoute$
      .pipe(first())
      .subscribe(([annee, etab, etape]) => {
        this.navigationFormService.setup_form({ annee: annee, siret: etab, etape: etape })
      });

    let annee$ = merge(this.navigation.anneeSelectionnee$)
    annee$
      .pipe(takeUntil(this._stop$))
      .subscribe(annee => {
        this.navigationFormService.setup_form_annee(annee)
      });

    let siret$ = merge(this.navigation.etablissementSelectionnee$)
    siret$
      .pipe(takeUntil(this._stop$))
      .subscribe(siret => {
        this.navigationFormService.setup_form_etab(siret)
      });


    let etape$ = merge(this.navigation.etapeBudgetaireSelectionnee$)
    etape$
      .pipe(takeUntil(this._stop$))
      .subscribe(etape => {
        this.navigationFormService.setup_form_etape(etape);
      });

    // Mise à jour de la route selon les paramètres.
    combineLatest([
      this.navigation.etablissementSelectionnee$,
      this.navigation.anneeSelectionnee$,
      this.navigation.etapeBudgetaireSelectionnee$,
    ])
      .pipe(takeUntil(this._stop$))
      .subscribe(([siret, annee, etape]) => {

        let queryParams = {}
        queryParams[ETAB_KEY] = siret
        queryParams[ANNEE_KEY] = annee
        queryParams[ETAPE_KEY] = etape

        this.router.navigate(
          [],
          {
            relativeTo: this.route,
            queryParams,
            queryParamsHandling: 'merge',
          })
      });
  }

  private _debug(msg: string) {
    console.debug(`[${BudgetParametrageNavComponent.name}] ${msg}`);
  }

  ngOnDestroy(): void {
    this.componentService.destroy()
    this._stop$.next();
    this._stop$.complete();
  }
}
