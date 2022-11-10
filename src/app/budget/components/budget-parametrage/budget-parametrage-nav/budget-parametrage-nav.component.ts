import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, merge, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { EtapeBudgetaire } from 'src/app/budget/models/etape-budgetaire';
import { BudgetParametrageComponentService, Navigation, NavigationFormulaireService } from '../budget-parametrage-component.service';
import { ANNEE_KEY, BudgetParametrageNavFormulaireModel, ETAB_KEY, ETAPE_KEY } from './budget-parametrage-nav-formulaire-model';


@Component({
  selector: 'app-budget-parametrage-nav',
  templateUrl: './budget-parametrage-nav.component.html',
  styleUrls: ['./budget-parametrage-nav.component.css']
})
export class BudgetParametrageNavComponent implements OnInit, OnDestroy {

  formulaire = new BudgetParametrageNavFormulaireModel()

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

    this.navigation = componentService.navigation
    this.navigationFormService = componentService.navigationFormulaireService

    this._etablissementFromRoute$ = this.route.queryParams
      .pipe(
        map(params => params[ETAB_KEY]),
        // tap(etablissement => this._debug(`Reçoit l'établissement de la route: ${etablissement}`)),
      );
    this._anneeFromRoute$ = this.route.queryParams
      .pipe(
        map(params => {
          let annee = params[ANNEE_KEY]
          return annee;
        }),
        // tap(annee => this._debug(`Reçoit l'annee de la route: ${annee}`)),
      );
    this._etapeFromRoute$ = this.route.queryParams
      .pipe(
        map(params => params[ETAPE_KEY] as EtapeBudgetaire),
        // tap(etape => this._debug(`Reçoit l'étape de la route: ${etape}`)),
      );

    // Branche le formulaire au component service
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

    /*
     Positionne les options de navigation selon les queryParams ou le component service.
     */
    let annee$ = merge(this._anneeFromRoute$, this.navigation.anneeSelectionnee$)
    let anneesDisponibles$ = this.navigationFormService.anneesDisponibles$
      .pipe(filter(annees => Boolean(annees) && annees.length > 0));
    let infoAnnees$ = combineLatest([annee$, anneesDisponibles$])

    infoAnnees$
      .pipe(takeUntil(this._stop$))
      .subscribe(([annee, anneesDisponibles]) => {
        this.formulaire.setup_annees(annee, anneesDisponibles)
      });

    let siret$ = merge(this._etablissementFromRoute$, this.navigation.etablissementSelectionnee$)
    let etablissementsDisponibles$ = this.navigationFormService.etablissementsDisponibles$
      .pipe( filter(etabs => Boolean(etabs) && etabs.length > 0));
    let infoEtab$ = combineLatest([siret$, etablissementsDisponibles$])
    infoEtab$
      .pipe(takeUntil(this._stop$))
      .subscribe(([siret, etablissements]) => {
        this.formulaire.setup_etablissement(siret, etablissements)
      });


    let etape$ = merge(this._etapeFromRoute$, this.navigation.etapeBudgetaireSelectionnee$)
    let etapesDisponibles$ = this.navigationFormService.etapesDisponibles$
      .pipe(filter(etapes => Boolean(etapes) && etapes.length > 0));

    let infoEtape$ = combineLatest([etape$, etapesDisponibles$]);
    infoEtape$
      .pipe(takeUntil(this._stop$))
      .subscribe(([etape, etapesDisponibles]) => {
        this.formulaire.setup_etapes(etape, etapesDisponibles);
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
    this._stop$.next();
    this._stop$.complete();
  }
}
