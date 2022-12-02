import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { EChartsOption } from "echarts";
import { Subject, takeUntil } from "rxjs";
import { DonneesBudgetaires } from "../../models/donnees-budgetaires";
import { Pdc } from "../../models/plan-de-comptes";
import { EchartsUtilsService } from "../../services/echarts-utils.service";
import { VisualisationComponentService } from "../budget-card/budget-card-component.service";
import { BudgetParametrageComponentService } from "../budget-parametrage/budget-parametrage-component.service";
import { EchartsViewModel } from "./EchartsViewModel";

export interface ChartExportImage {
  width: number
  height: number
  data_url: string
}

@Component({
  selector: 'app-abstract-visualisation',
  template: '<p></p>',
})
export abstract class VisualisationComponent implements OnInit, OnDestroy {

  protected _stop$ = new Subject<void>()

  constructor(
    protected echartsUtilsService: EchartsUtilsService,
    protected visualisationService: VisualisationComponentService,
    protected componentService?: BudgetParametrageComponentService,
  ) {
    this.visualisationService
      .visualisationUpdate$
      .pipe(takeUntil(this._stop$))
      .subscribe(() => this.refresh())
  }

  ngOnInit(): void {
    if (this.componentService)
      this.componentService.register_graphe_exporter(this)
  }

  ngOnDestroy(): void {
    if (this.componentService)
      this.componentService.unregister_graphe_exporter(this)
    
    this._stop$.next()
    this._stop$.complete()
  }

  get titre() {
    return this.visualisationService.titre
  }

  get description() {
    return this.visualisationService.description
  }

  /** Le viewmodel courant*/
  echartsVm?: EchartsViewModel

  /** Les options pour le rendu du graphe en PDF */
  protected pdf_echarts_options: EChartsOption
  protected pdf_chart_width: number = 1000
  protected pdf_chart_height: number = 500

  /** Transforme les données budgetaires brutes en view model pour echarts*/
  abstract toChartsViewModel(donnees: DonneesBudgetaires, infos_pdc: Pdc.InformationsPdc): EchartsViewModel

  /** Rend la visualisation pour une intégration vers un PDF, renvoie un dataurl*/
  visualisationDataUrlPourPdf(): ChartExportImage  {
    let partial = {
      title: {
        show: true,
        text: this.titre,
      }
    }
    let opts = Object.assign({}, this.pdf_echarts_options, partial)
    let data_url = this.echartsUtilsService.render_chart_as_dataurl(
      this.pdf_chart_width, 
      this.pdf_chart_height, 
      opts
    )

    return {
      width: this.pdf_chart_width,
      height: this.pdf_chart_height,
      data_url
    }
  }

  visualisationSvgPourPdf(): string {
    let partial = {
      title: {
        show: true,
        text: this.titre,
      }
    }
    let opts = Object.assign({}, this.pdf_echarts_options, partial)
    return this.echartsUtilsService.render_chart_as_svg(this.pdf_chart_width, this.pdf_chart_height, opts)
  }

  /** Appellé pour rafraichir le graphe*/
  abstract refresh()
}