import { Component, Input, Optional } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DonneesBudgetaires } from 'src/app/budget/models/donnees-budgetaires';
import { Pdc } from 'src/app/budget/models/plan-de-comptes';
import { PrepareDonneesVisualisation, VisualisationPourDonut } from 'src/app/budget/services/prepare-donnees-visualisation.service';
import { PrettyCurrencyFormatter } from 'src/app/budget/services/pretty-currency-formatter';
import { object_is_empty } from 'src/app/utils';
import { EchartsViewModel } from '../EchartsViewModel';
import { VisualisationComponent } from '../visualisation.component';
import { LayoutConfig, LAYOUT_CONFIGS, LAYOUT_MODE } from './layout-config';

import { EchartsUtilsService } from 'src/app/budget/services/echarts-utils.service';
import { BudgetParametrageComponentService } from '../../budget-parametrage/budget-parametrage-component.service';
import { VisualisationComponentService } from '../../budget-card/budget-card-component.service';

export type TypeVue = 'general' | 'detaille'

export enum ModePresentationMontant {
  MONTANT = "montant",
  POURCENTAGE = "pourcentage",
}

export const montantPresentationOptions = [
  { value: ModePresentationMontant.MONTANT, viewValue: "Montant" },
  { value: ModePresentationMontant.POURCENTAGE, viewValue: "Pourcentage" },
];

const SMALL_MODE_MAX_WIDTH = 730
const MEDIUM_MODE_MAX_WIDTH = 1200

@Component({
  selector: 'app-visualisation-donut',
  templateUrl: './visualisation-donut.html',
  styleUrls: ['./visualisation-donut.css'],
  providers: [
    {
      provide: VisualisationComponent,
      useExisting: VisualisationDonut,
    }
  ]
})
export class VisualisationDonut extends VisualisationComponent {

  echartsVm?: EchartsViewModel

  get donneesBudget() {
    return this.visualisationService.donnees_budgetaires
  }

  get informationPlanDeCompte() {
    return this.visualisationService.informations_pdc
  }

  @Input()
  public set rd(value: 'recette' | 'depense') {
    this._rd = value;
    this.refresh()
  }

  public set typeVue(value: TypeVue) {
    this._typeVue = value;
    this.refresh()
  }

  public set typeNomenclature(value: Pdc.TypeNomenclature) {

    if (this.informationPlanDeCompte && object_is_empty(this.informationPlanDeCompte.references_fonctionnelles)) {
      this._debug(`Aucune donnée provenant de la nomenclature de fontions. On visualise par nature.`);
      this._typeNomenclature = 'nature';
    } else {
      this._typeNomenclature = value;
    }

    this.refresh()
  }

  selectedMontantPresentation: ModePresentationMontant = ModePresentationMontant.MONTANT;

  set layoutMode(layoutMode: LAYOUT_MODE) {
    if (this._layoutMode === layoutMode) return
    this._layoutMode = layoutMode
    this.refresh()
  }

  constructor(
    private mapper: PrepareDonneesVisualisation,
    private prettyCurrencyFormatter: PrettyCurrencyFormatter,
    echartsUtilsService: EchartsUtilsService,
    visualisationService: VisualisationComponentService,
    @Optional()
    parametrageService?: BudgetParametrageComponentService,
  ) {
    super(echartsUtilsService, visualisationService, parametrageService);
  }

  get afficherOptionsChoixNomenclatures() {
    let afficher = true
    afficher = afficher && Boolean(this.informationPlanDeCompte)
    afficher = afficher
      && !object_is_empty(this.informationPlanDeCompte.references_fonctionnelles)
      && !object_is_empty(this.informationPlanDeCompte.comptes_nature)
    return afficher
  }

  onResize(evt: ResizeObserverEntry[]) {
    if (!evt || evt.length === 0
      || !evt[0].contentBoxSize || evt[0].contentBoxSize.length === 0)
      return;

    let w = evt[0].contentRect.width
    // this._debug(`width: ${w}`)

    let _layoutMode: LAYOUT_MODE = 'large'
    if (w <= SMALL_MODE_MAX_WIDTH) _layoutMode = 'small'
    else if (w <= MEDIUM_MODE_MAX_WIDTH) _layoutMode = 'medium'

    this.layoutMode = _layoutMode
  }

  toChartsViewModel(
    donneesBudget: DonneesBudgetaires,
    informationPlanDeCompte: Pdc.InformationsPdc,
  ): EchartsViewModel {

    let typeVue = this.typeVue
    let modePresentationMontant = this.selectedMontantPresentation

    let nomenclature = Pdc.extraire_nomenclature(informationPlanDeCompte, this.typeNomenclature)
    let donneesVisualisation = this.mapper.donneesPourDonut(donneesBudget, nomenclature, this.rd, typeVue)

    let intitule = `Budget de \n {b|${donneesVisualisation.prettyTotal}}`
    let chartOption: EChartsOption = this.compute_echarts_options(intitule, donneesVisualisation, modePresentationMontant, this.layoutConfig);

    this.pdf_echarts_options = this.compute_echarts_options(
      intitule,
      donneesVisualisation,
      modePresentationMontant,
      this.pdfLayoutConfig
    );

    let chartInitOptions = { renderer: 'svg' }

    let chartData = {
      options: chartOption,
      chartInitOptions,
    }

    return chartData;
  }

  compute_echarts_options(
    intitule: string,
    donneesVisualisation: VisualisationPourDonut,
    modePresentationMontant: ModePresentationMontant,
    layoutConfig: LayoutConfig,
  ) {
    let data_dict = donneesVisualisation.data_dict;
    let data = donneesVisualisation.data;

    let font_size = layoutConfig.chart_font_size;
    let show_legend = layoutConfig.show_legend;
    let horizontal_positon = layoutConfig.donut_horizontal_position;

    let legend_formatter = (name) => `${name} - ${this.prettyCurrencyFormatter.format(data_dict[name])}`;
    if (modePresentationMontant == ModePresentationMontant.POURCENTAGE) {
      let toPourcentage = (name) => this.prettyCurrencyFormatter.format_percentage(data_dict[name], donneesVisualisation.total);
      legend_formatter = (name) => `${name} (${toPourcentage(name)}) `
    }

    let chartOption: EChartsOption = {
      title: {
        text: this.titre,
        show: false,
      },
      tooltip: {
        trigger: 'item',
        formatter: (item) => `${item.name}: <b> ${this.prettyCurrencyFormatter.format(item.value)}</b>`,
      },
      legend: {
        show: show_legend,
        type: 'scroll',
        top: layoutConfig.legend_top,
        left: layoutConfig.legend_left,
        right: layoutConfig.legend_right,

        pageIconSize: layoutConfig.page_icon_size,
        pageFormatter: layoutConfig.page_formatter,

        orient: 'vertical',
        formatter: legend_formatter,
        textStyle: {
          overflow: 'truncate',
          width: layoutConfig.legend_max_width,
        },
        tooltip: {
          triggerOn: 'mousemove|click',
          show: true,
          formatter: (item) => legend_formatter(item.name),
        }
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: [horizontal_positon, '50%'],
          label: {
            position: 'center',
            fontSize: font_size,
            formatter: () => "" + intitule,
            rich: {
              b: { fontWeight: "bold", fontSize: font_size }
            }
          },
          data: data,
        }
      ]
    };

    return chartOption;
  }

  refresh() {
    if (!this.informationPlanDeCompte || !this.donneesBudget) return
    let chartVm = this.toChartsViewModel(this.donneesBudget, this.informationPlanDeCompte);
    this.echartsVm = chartVm
  }

  // Accessors & boilerplates
  private _rd: 'recette' | 'depense';
  public get rd(): 'recette' | 'depense' {
    return this._rd;
  }

  private _typeVue: TypeVue = 'general';
  public get typeVue(): TypeVue {
    return this._typeVue;
  }

  private _typeNomenclature: Pdc.TypeNomenclature = "fonctions";
  public get typeNomenclature(): Pdc.TypeNomenclature {
    return this._typeNomenclature;
  }

  private _layoutMode: LAYOUT_MODE = 'medium'
  get layoutMode() { return this._layoutMode }

  get layoutConfig() { return LAYOUT_CONFIGS.get(this.layoutMode) }

  get pdfLayoutConfig() { return LAYOUT_CONFIGS.get('pdf') }

  get montantPresentationOptions() {
    return montantPresentationOptions
  }

  onClicVueGenerale = () => this.typeVue = 'general'

  onClicVueDetaille = () => this.typeVue = 'detaille'

  onClicNomenclatureFonctions = () => this.typeNomenclature = "fonctions"

  onClicNomenclatureNature = () => this.typeNomenclature = "nature"

  onSelectedMontantPresentationChange = () => this.refresh()

  private _debug(msg: string) {
    console.debug(`[BUDGET_PRINCIPAL_GRAPHE] ${msg}`);
  }
}