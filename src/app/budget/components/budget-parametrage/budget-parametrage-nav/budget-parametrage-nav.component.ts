import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, first, map, takeUntil } from 'rxjs/operators';
import { EtapeBudgetaire, EtapeBudgetaireUtil } from 'src/app/budget/services/budget.service';
import { BudgetParametrageComponentService, PresentationType } from '../budget-parametrage-component.service';

@Component({
  selector: 'app-budget-parametrage-nav',
  templateUrl: './budget-parametrage-nav.component.html',
  styleUrls: ['./budget-parametrage-nav.component.css']
})
export class BudgetParametrageNavComponent implements OnInit, OnDestroy {

  anneesDisponibles: number[] = [new Date().getFullYear()];
  anneesSelectedIndex: number = 0;

  readonly etapeOptions = [
    { value: EtapeBudgetaire.COMPTE_ADMINISTRATIF, viewValue: "Compte administratif" },
  ];
  selectedEtape: EtapeBudgetaire = EtapeBudgetaire.COMPTE_ADMINISTRATIF;

  readonly presentationOptions = [
    { value: PresentationType.SIMPLIFIE, viewValue: "Présentation simplifiée" },
    { value: PresentationType.AVANCEE, viewValue: "Présentation avancée" },
    { value: PresentationType.PAR_HABITANT, viewValue: "Présentation par habitant" },
    { value: PresentationType.PAR_EURO, viewValue: "Présentation par euros" },
  ];
  selectedPresentation: PresentationType = PresentationType.SIMPLIFIE;

  private _stop$ = new Subject<void>();
  private _anneeFromRoute$: Observable<number>;
  private _etapeFromRoute: Observable<EtapeBudgetaire>;
  private _presentationFromRoute: Observable<number>;

  constructor(
    private componentService: BudgetParametrageComponentService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this._anneeFromRoute$ = this.route.queryParams
      .pipe(
        map(params => {
          let annee = Number(params['annee'])
          return annee;
        }),
      );
    this._etapeFromRoute = this.route.queryParams
      .pipe(
        map(params => params['etape'] as EtapeBudgetaire),
        filter(etape => EtapeBudgetaireUtil.hasValue(etape)),
      );
    this._presentationFromRoute = this.route.queryParams
      .pipe(
        map(params => Number(params['presentation'])),
        filter(presentation => presentation in PresentationType),
      );
  }

  ngOnInit(): void {
    /*
     Positionne les options de navigation selon les queryParams
     ou le component service.
     */
    let annee$ = merge(this._anneeFromRoute$, this.componentService.navigation.anneeSelectionnee$)
      .pipe(distinctUntilChanged());
    let anneesDisponibles$ = this.componentService.anneesDisponibles$
      .pipe(
        distinctUntilChanged(),
        filter(annees => Boolean(annees) && annees.length > 0),
      );
    let infoAnnees$ = combineLatest([annee$, anneesDisponibles$])

    infoAnnees$
      .pipe(takeUntil(this._stop$))
      .subscribe(([annee, anneesDisponibles]) => {
        let index = anneesDisponibles.indexOf(annee);
        // this._debug(`Reçu année: ${annee} et années disponibles: ${anneesDisponibles}`);
        // this._debug(`this.anneesDisponibles: ${anneesDisponibles}`);
        // this._debug(`this.anneesSelectedIndex: ${index}`);
        this.anneesDisponibles = anneesDisponibles;
        this.anneesSelectedIndex = index;
      });

    merge(this._etapeFromRoute, this.componentService.navigation.etapeBudgetaireSelectionnee$)
      .pipe(
        distinctUntilChanged(),
        takeUntil(this._stop$),
      )
      .subscribe(etape => this.selectedEtape = etape);

    merge(this._presentationFromRoute, this.componentService.navigation.presentationSelectionnee$)
      .pipe(
        distinctUntilChanged(),
        takeUntil(this._stop$),
      )
      .subscribe(presentation => this.selectedPresentation = presentation);

    // Initialisation des informations de navigation
    infoAnnees$
      .pipe(first())
      .subscribe(
        ([annee, anneesDisponibles]) => {
          let anneeOuDefault = (anneesDisponibles.indexOf(annee) == -1) ? anneesDisponibles[0] : annee;
          this.componentService.navigation.selectionneAnnee(anneeOuDefault)
        }
      );
    this.componentService.navigation.selectionneEtapeBudgetaire(this.selectedEtape);
    this.componentService.navigation.selectionnePresentation(this.selectedPresentation);

    // Mise à jour de la route selon les paramètres.
    combineLatest([
      this.componentService.navigation.anneeSelectionnee$,
      this.componentService.navigation.etapeBudgetaireSelectionnee$,
      this.componentService.navigation.presentationSelectionnee$,
    ])
      .pipe(takeUntil(this._stop$))
      .subscribe(([annee, etape, presentation]) => {

        this.router.navigate(
          [],
          {
            relativeTo: this.route,
            queryParams: {
              annee: annee,
              etape: etape,
              presentation: presentation,
            },
            queryParamsHandling: 'merge',
          })
      });
  }

  onSelectionneAnnee(event: MatTabChangeEvent) {
    let index = event.index;
    let annee = this.anneesDisponibles[index];
    // this._debug(`onSelectionneAnnee(${annee})`);
    this.componentService.navigation.selectionneAnnee(annee);
  }

  onSelectedEtapeChange(etape: EtapeBudgetaire) {
    this.componentService.navigation.selectionneEtapeBudgetaire(etape);
  }

  onPresentationChange(presentation: PresentationType) {
    this.componentService.navigation.selectionnePresentation(presentation);
  }

  private _debug(msg: string) {
    console.debug(`[${BudgetParametrageNavComponent.name}] ${msg}`);
  }

  ngOnDestroy(): void {
    this._stop$.next();
    this._stop$.complete();
  }
}
