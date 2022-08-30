import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, merge, Observable, of, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { EtapeBudgetaire, EtapeBudgetaireUtil } from 'src/app/budget/services/budget.service';
import { BudgetParametrageComponentService, PresentationType } from '../budget-parametrage-component.service';

@Component({
  selector: 'app-budget-parametrage-nav',
  templateUrl: './budget-parametrage-nav.component.html',
  styleUrls: ['./budget-parametrage-nav.component.css']
})
export class BudgetParametrageNavComponent implements OnInit, OnDestroy {

  anneesDisponibles: number[] = [new Date().getFullYear()];
  anneesSelectedIndex: number;

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
        map(params => Number(params['annee'])),
        filter(annee => Boolean(annee))
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
    let annee$ = merge(this._anneeFromRoute$, this.componentService.navigation.anneeSelectionnee$, of(0));
    combineLatest([annee$, this.componentService.anneesDisponibles$])
      .pipe(takeUntil(this._stop$))
      .subscribe(([annee, anneesDisponibles]) => {
        this._debug(JSON.stringify([annee, anneesDisponibles]));
        let index = anneesDisponibles.indexOf(annee);
        this.anneesDisponibles = anneesDisponibles;
        this.anneesSelectedIndex = index;
      });

    merge(this._etapeFromRoute, this.componentService.navigation.etapeBudgetaireSelectionnee$)
      .pipe(takeUntil(this._stop$))
      .subscribe(etape => this.selectedEtape = etape);

    merge(this._presentationFromRoute, this.componentService.navigation.presentationSelectionnee$)
      .pipe(takeUntil(this._stop$))
      .subscribe(presentation => this.selectedPresentation = presentation);

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
