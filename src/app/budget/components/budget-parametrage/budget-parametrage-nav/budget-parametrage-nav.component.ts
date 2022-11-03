import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, first, map, takeUntil } from 'rxjs/operators';
import { EtapeComboItemViewModel, EtablissementComboItemViewModel } from 'src/app/budget/models/view-models';
import { EtapeBudgetaire, EtapeBudgetaireUtil } from 'src/app/budget/services/budget.service';
import { BudgetParametrageComponentService, PresentationType } from '../budget-parametrage-component.service';

@Component({
  selector: 'app-budget-parametrage-nav',
  templateUrl: './budget-parametrage-nav.component.html',
  styleUrls: ['./budget-parametrage-nav.component.css']
})
export class BudgetParametrageNavComponent implements OnInit, OnDestroy {

  anneesDisponibles: string[] = [new Date().getFullYear().toString()];
  anneesSelectedIndex: number = 0;

  etapeOptions: EtapeComboItemViewModel[] = []
  selectedEtape: EtapeBudgetaire = EtapeBudgetaire.COMPTE_ADMINISTRATIF;

  etablissementOptions: EtablissementComboItemViewModel[] = []
  selectedEtablissement: string = ""

  readonly presentationOptions = [
    { value: PresentationType.SIMPLIFIE, viewValue: "Présentation simplifiée" },
    { value: PresentationType.AVANCEE, viewValue: "Présentation avancée" },
    { value: PresentationType.PAR_HABITANT, viewValue: "Présentation par habitant" },
    { value: PresentationType.PAR_EURO, viewValue: "Présentation par euros" },
  ];
  selectedPresentation: PresentationType = PresentationType.SIMPLIFIE;

  private _stop$ = new Subject<void>();
  private _etablissementFromRoute$: Observable<string>;
  private _anneeFromRoute$: Observable<string>;
  private _etapeFromRoute$: Observable<EtapeBudgetaire>;
  private _presentationFromRoute$: Observable<number>;

  constructor(
    private componentService: BudgetParametrageComponentService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this._etablissementFromRoute$ = this.route.queryParams
      .pipe(
        map(params => params['etab']),
      );
    this._anneeFromRoute$ = this.route.queryParams
      .pipe(
        map(params => {
          let annee = params['annee']
          return annee;
        }),
        // tap(annee => this._debug(`Reçu l'année ${annee} des paramètres de route`)),
      );
    this._etapeFromRoute$ = this.route.queryParams
      .pipe(
        map(params => params['etape'] as EtapeBudgetaire),
        filter(etape => EtapeBudgetaireUtil.hasValue(etape)),
      );
    this._presentationFromRoute$ = this.route.queryParams
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
    
    let siret$ = merge(this._etablissementFromRoute$, this.componentService.navigation.etablissementSelectionnee$)
      .pipe(distinctUntilChanged());
    let etablissementsDisponibles$ = this.componentService.etablissementsDisponibles$
      .pipe(
        distinctUntilChanged(),
        filter(etabs => Boolean(etabs) && etabs.length > 0),
      );
    let etapesDisponibles$ = this.componentService.etapesDisponibles$
      .pipe(
        distinctUntilChanged(),
        filter(etapes => Boolean(etapes) && etapes.length > 0),
      )
    etapesDisponibles$
      .pipe(takeUntil(this._stop$))
      .subscribe((etapes) => {
        this.etapeOptions = etapes;
      })

    let infoEtab$ = combineLatest([siret$, etablissementsDisponibles$])
    infoEtab$
      .pipe(takeUntil(this._stop$))
      .subscribe(([siret, etablissements]) => {
        // this._debug(`Reçu siret: ${siret} et ${etablissements.length} établissement(s)`);
        
        this.etablissementOptions = etablissements;
        this.selectedEtablissement = siret;
      });

    merge(this._etapeFromRoute$, this.componentService.navigation.etapeBudgetaireSelectionnee$)
      .pipe(
        distinctUntilChanged(),
        takeUntil(this._stop$),
      )
      .subscribe(etape => this.selectedEtape = etape);

    merge(this._presentationFromRoute$, this.componentService.navigation.presentationSelectionnee$)
      .pipe(
        distinctUntilChanged(),
        takeUntil(this._stop$),
      )
      .subscribe(presentation => this.selectedPresentation = presentation);

    // Initialisation des informations de navigation
    infoEtab$
      .pipe(first())
      .subscribe(
        ([siret, etablissements]) => {
          if (!siret && etablissements && etablissements.length > 0)
            siret = this.etablissementOptions[0].value
          this.componentService.navigation.selectionneEtablissement(siret)
        }
      );
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
      this.componentService.navigation.etablissementSelectionnee$,
      this.componentService.navigation.anneeSelectionnee$,
      this.componentService.navigation.etapeBudgetaireSelectionnee$,
      this.componentService.navigation.presentationSelectionnee$,
    ])
      .pipe(takeUntil(this._stop$))
      .subscribe(([siret, annee, etape, presentation]) => {

        this.router.navigate(
          [],
          {
            relativeTo: this.route,
            queryParams: {
              etab: siret,
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

  onSelectedEtablissementChange(siret: string) {
    this.componentService.navigation.selectionneEtablissement(siret)
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
