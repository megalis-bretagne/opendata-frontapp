import { Component, Input } from "@angular/core";
import { DonneesBudgetaires } from "../../models/donnees-budgetaires";
import { Pdc } from "../../models/plan-de-comptes";
import { EchartsUtilsService } from "../../services/echarts-utils.service";
import { EchartsViewModel } from "./EchartsViewModel";

@Component({
  selector: 'app-abstract-visualisation',
  template: '<p></p>',
})
export abstract class VisualisationComponent {

  constructor(
    protected echartsUtilsService: EchartsUtilsService,
  ) { }

  @Input()
  titre: string

  @Input()
  description

  /** Le viewmodel courant*/
  echartsVm?: EchartsViewModel

  /** Transforme les données budgetaires brutes en view model pour echarts*/
  abstract toChartsViewModel(_0: DonneesBudgetaires, _1: Pdc.InformationsPdc): EchartsViewModel

  /** Rend la visualisation pour une intégration vers un PDF, renvoie un dataurl*/
  visualisationDataUrlPourPdf(): string  {
    let partial = {
      title: {
        show: true,
        text: this.titre,
      }
    }
    let opts = Object.assign({}, this.echartsVm.options, partial)
    return this.echartsUtilsService.render_chart_as_dataurl(2000, 500, opts)
  }

  /** Appellé pour rafraichir le graphe*/
  abstract refresh()
}