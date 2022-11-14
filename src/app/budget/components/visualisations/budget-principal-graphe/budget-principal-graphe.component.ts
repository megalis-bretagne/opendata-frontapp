import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { EChartsOption } from 'echarts';
import { BehaviorSubject, Subject } from 'rxjs';
import { DonneesBudgetaires } from 'src/app/budget/models/donnees-budgetaires';
import { Pdc } from 'src/app/budget/models/plan-de-comptes';
import { PrepareDonneesVisualisation, VisualisationPourDonut } from 'src/app/budget/services/prepare-donnees-visualisation.service';
import { PrettyCurrencyFormatter } from 'src/app/budget/services/pretty-currency-formatter';
import { object_is_empty } from 'src/app/utils';
import { LAYOUT_CONFIGS, LAYOUT_MODE } from './layout-config';


export type EchartsViewModel = {
  options: EChartsOption,
  chartInitOptions: {},
}
export type TypeVue = 'general' | 'detaille'

export enum ModePresentationMontant {
  MONTANT = "montant",
  POURCENTAGE = "pourcentage",
}

const SMALL_MODE_MAX_WIDTH = 730
const MEDIUM_MODE_MAX_WIDTH = 1200

@Component({
  selector: 'app-budget-principal-graphe',
  templateUrl: './budget-principal-graphe.component.html',
  styleUrls: ['./budget-principal-graphe.component.css'],
})
export class BudgetPrincipalGrapheComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  donneesBudget: DonneesBudgetaires

  @Input()
  informationPlanDeCompte: Pdc.InformationPdc

  @Input()
  rd: 'recette' | 'depense';

  readonly montantPresentationOptions = [
    { value: ModePresentationMontant.MONTANT, viewValue: "Montant" },
    { value: ModePresentationMontant.POURCENTAGE, viewValue: "Pourcentage" },
  ];
  selectedMontantPresentation: ModePresentationMontant = ModePresentationMontant.MONTANT;

  typeVue: TypeVue = 'general'
  typeNomenclature: Pdc.TypeNomenclature = "fonctions"

  private _layoutMode: LAYOUT_MODE = 'medium'
  get layoutMode() { return this._layoutMode }
  set layoutMode(layoutMode: LAYOUT_MODE) {
    if (this._layoutMode === layoutMode) return
    this._layoutMode = layoutMode
    this._debug(`layout mode: ${this._layoutMode}`)
    this.refresh()
  }
  get layoutConfig() { return LAYOUT_CONFIGS.get(this.layoutMode) }

  echartData$ = new BehaviorSubject(null);

  get afficherOptionsChoixNomenclatures() {
    let afficher = true
    afficher = afficher && Boolean(this.informationPlanDeCompte)
    afficher = afficher
      && !object_is_empty(this.informationPlanDeCompte.references_fonctionnelles)
      && !object_is_empty(this.informationPlanDeCompte.comptes_nature)
    return afficher
  }

  private _stop$ = new Subject();

  constructor(
    private mapper: PrepareDonneesVisualisation,
    private prettyCurrencyFormatter: PrettyCurrencyFormatter) {

  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.donneesBudget && changes.informationPlanDeCompte
      && changes.donneesBudget.currentValue && changes.informationPlanDeCompte.currentValue) {
      this.refresh()
    }
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

  ngOnDestroy(): void {
    this._stop$.next(null);
  }

  toChartsViewModel(
    donneesBudget: DonneesBudgetaires,
    informationPlanDeCompte: Pdc.InformationPdc,
    typeVue: TypeVue,
    modePresentationMontant: ModePresentationMontant,
  ): EchartsViewModel {

    if (object_is_empty(informationPlanDeCompte.references_fonctionnelles)) {
      console.info(`Aucune donnée provenant de la nomenclature de fontions. On visualise par nature.`);
      this.typeNomenclature = 'nature';
    }

    let nomenclature = Pdc.extraire_nomenclature(informationPlanDeCompte, this.typeNomenclature)
    let donneesVisualisation = this.mapper.donneesPourDonut(donneesBudget, nomenclature, this.rd, typeVue)


    let intitule = `Budget de \n {b|${donneesVisualisation.prettyTotal}}`
    let chartOption: EChartsOption = this.echartsOptions(intitule, donneesVisualisation, modePresentationMontant);

    let chartInitOptions = {}

    let chartData = {
      options: chartOption,
      chartInitOptions,
    }

    return chartData;
  }

  echartsOptions(
    intitule: string,
    donneesVisualisation: VisualisationPourDonut,
    modePresentationMontant: ModePresentationMontant,
  ) {
    let data_dict = donneesVisualisation.data_dict;
    let data = donneesVisualisation.data;

    let font_size = this.layoutConfig.chart_font_size;
    let show_legend = this.layoutConfig.show_legend;
    let horizontal_positon = this.layoutConfig.donut_horizontal_position;

    let legend_formatter = (name) => `${name} - ${this.prettyCurrencyFormatter.format(data_dict[name])}`;
    if (modePresentationMontant == ModePresentationMontant.POURCENTAGE) {
      let toPourcentage = (name) => this.prettyCurrencyFormatter.format_percentage(data_dict[name], donneesVisualisation.total);
      legend_formatter = (name) => `${name} (${toPourcentage(name)}) `
    }

    let chartOption: EChartsOption = {
      name: ``,
      tooltip: {
        trigger: 'item',
        formatter: (item) => `${item.name}: <b> ${this.prettyCurrencyFormatter.format(item.value)}</b>`,
      },
      legend: {
        show: show_legend,
        type: 'scroll',
        left: this.layoutConfig.legend_left,
        orient: 'vertical',
        formatter: legend_formatter,
        textStyle: {
          overflow: 'truncate',
          width: this.layoutConfig.legend_max_width,
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

  onClicVueGenerale() {
    this.typeVue = 'general';
    this.refresh();
  }

  onClicVueDetaille() {
    this.typeVue = 'detaille';
    this.refresh();
  }

  onClicNomenclatureFonctions() {
    this.typeNomenclature = "fonctions";
    this.refresh();
  }

  onClicNomenclatureNature() {
    this.typeNomenclature = "nature";
    this.refresh();
  }

  onSelectedMontantPresentationChange() {
    this.refresh();
  }

  refresh() {
    let chartData = this.toChartsViewModel(this.donneesBudget, this.informationPlanDeCompte, this.typeVue, this.selectedMontantPresentation);
    this.echartData$.next(chartData)
  }

  private _debug(msg: string) {
    console.debug(`[BUDGET_PRINCIPAL_GRAPHE] ${msg}`);
  }


}
