import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, mergeMap, switchMap, takeUntil, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { Annee, Siret } from '../../models/common-types';
import { DonneesBudgetaires } from '../../models/donnees-budgetaires';
import { EtapeBudgetaire } from '../../models/etape-budgetaire';
import { Pdc } from '../../models/plan-de-comptes';
import { IdentifiantVisualisation, PagesDeVisualisations } from '../../models/visualisation.model';
import { BudgetsStoresService } from '../../services/budgets-store.service';
import { IframeService } from '../../services/iframe.service';
import { RoutingService } from '../../services/routing.service';
import { isInError, LoadingState } from '../../store/states/call-states';
import { BudgetParametrageComponentService } from './budget-parametrage-component.service';

import { jsPDF } from 'jspdf'

const pageid: PagesDeVisualisations.PageId = 'default'

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
  informationsPlanDeCompte: Pdc.InformationsPdc

  isLoadingDisponibles$;
  errorInLoadingDisponibles$;

  id_visualisations: IdentifiantVisualisation[] = []

  iframeFragment = '';

  private _snapshot_annee?: Annee
  private _snapshot_siret?: Siret
  private _snapshot_etape?: EtapeBudgetaire

  private _stop$: Subject<void> = new Subject<void>();

  constructor(
    private budgetsStoresService: BudgetsStoresService,
    private componentService: BudgetParametrageComponentService,
    private routingService: RoutingService,
    private iframeService: IframeService,
    private router: Router,
  ) {

    this.user$ = this.componentService.user$;
    this.siren$ = this.componentService.siren$;


    let callState$ = this.siren$.pipe(
      switchMap(siren => this.budgetsStoresService.select_donnees_disponibles_callstate(siren))
    )

    this.isLoadingDisponibles$ = callState$
      .pipe(
        map(cs => !cs || cs === LoadingState.LOADING)
      )
    this.errorInLoadingDisponibles$ = callState$
      .pipe(
        map(cs => isInError(cs))
      )
  }

  ngOnInit(): void {

    let navigationValues$ = this.componentService.navigationFormulaireService.validatedNavigationValues$
    this.siren$
      .pipe(
        tap(siren => this.budgetsStoresService.load_budgets_disponibles_pour(siren)),
        takeUntil(this._stop$),
      )
      .subscribe()

    navigationValues$
      .pipe(
        tap(navValues => {
          console.debug(`[NAV VALUES] - ${navValues.annee}, ${navValues.siret}, ${navValues.etape}`)
          this._snapshot_annee = navValues.annee
          this._snapshot_siret = navValues.siret
          this._snapshot_etape = navValues.etape

          this.id_visualisations = []
          for (const graphe_id of PagesDeVisualisations.visualisation_pour_pageid(pageid)) {
            this.id_visualisations.push(
              { annee: navValues.annee, siret: navValues.siret, etape: navValues.etape, graphe_id }
            )
          }

          this.iframeFragment = this.compute_iframe_fragment(navValues.annee, navValues.siret, navValues.etape);
        }),

        mergeMap(navValues => {
          return this.budgetsStoresService.select_donnees_et_etabname(
            navValues.annee,
            navValues.siret,
            navValues.etape,
          )
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

  rendre_pdf() {
    let doc = new jsPDF()

    for (let i = 0; i < this.componentService.graphe_exporters.length; i++) {
      let graphe_exporter = this.componentService.graphe_exporters[i]
      let imageDesc = graphe_exporter.visualisationDataUrlPourPdf()

      let pos_x = 0
      let pos_y = doc.internal.pageSize.getHeight() / 4

      let w = doc.internal.pageSize.getWidth()
      let ratio = w / imageDesc.width
      let h = imageDesc.height * ratio

      doc.addImage(
        imageDesc.data_url, 
        'PNG', 
        pos_x, pos_y, 
        w, h,
      )
      
      if ((i+1) < this.componentService.graphe_exporters.length)
        doc.addPage()
    }

    doc.save('graphes.pdf')
  }

  compute_iframe_fragment(annee, siret, etape) {
    let path = this.routingService.external_url_consultation(annee, siret, etape)
    return this.iframeService.make_iframe_from_route_path(path)
  }

  navigate_vers_consultation_url() {

    let annee = this._snapshot_annee
    let siret = this._snapshot_siret
    let etape = this._snapshot_etape
    let path = this.routingService.external_url_consultation(annee, siret, etape)
    this.router.navigateByUrl(path)
  }

  ngOnDestroy(): void {
    this._stop$.next();
    this._stop$.complete();
    this.componentService.destroy()
  }
}
