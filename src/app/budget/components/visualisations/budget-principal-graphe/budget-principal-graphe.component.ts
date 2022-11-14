import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { EChartsOption } from 'echarts';
import { BehaviorSubject, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil, tap } from 'rxjs/operators';
import { DonneesBudgetaires } from 'src/app/budget/models/donnees-budgetaires';
import { Pdc } from 'src/app/budget/models/plan-de-comptes';
import { PrepareDonneesVisualisation, VisualisationPourDonut } from 'src/app/budget/services/prepare-donnees-visualisation.service';
import { PrettyCurrencyFormatter } from 'src/app/budget/services/pretty-currency-formatter';
import { object_is_empty } from 'src/app/utils';

export type EchartsViewModel = {
  options: EChartsOption,
  chartInitOptions: {},
}
export type TypeVue = 'general' | 'detaille'

export enum ModePresentationMontant {
  MONTANT = "montant",
  POURCENTAGE = "pourcentage",
}

let mediumOrLower = [Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium];

@Component({
  selector: 'app-budget-principal-graphe',
  templateUrl: './budget-principal-graphe.component.html',
  styleUrls: ['./budget-principal-graphe.component.css']
})
export class BudgetPrincipalGrapheComponent implements OnInit, OnChanges, OnDestroy {

  readonly montantPresentationOptions = [
    { value: ModePresentationMontant.MONTANT, viewValue: "Montant" },
    { value: ModePresentationMontant.POURCENTAGE, viewValue: "Pourcentage" },
  ];
  selectedMontantPresentation: ModePresentationMontant = ModePresentationMontant.MONTANT;

  echartData$ = new BehaviorSubject(null);
  typeVue: TypeVue = 'general'
  typeNomenclature: Pdc.TypeNomenclature = "fonctions"

  get afficherOptionsChoixNomenclatures() {
    let afficher = true
    afficher = afficher && Boolean(this.informationPlanDeCompte)
    afficher = afficher
      && !object_is_empty(this.informationPlanDeCompte.references_fonctionnelles)
      && !object_is_empty(this.informationPlanDeCompte.comptes_nature)
    return afficher
  }

  @Input()
  donneesBudget: DonneesBudgetaires

  @Input()
  informationPlanDeCompte: Pdc.InformationPdc

  @Input()
  rd: 'recette' | 'depense';

  private _stop$ = new Subject();

  constructor(
    private mapper: PrepareDonneesVisualisation,
    private prettyCurrencyFormatter: PrettyCurrencyFormatter,
    private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {

    this.breakpointObserver.observe(mediumOrLower)
      .pipe(
        map(state => state.matches),
        distinctUntilChanged(),
        tap(_ => {
          try {
            this.refresh()
          } catch (err) { }
        }),
        takeUntil(this._stop$),
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.donneesBudget && changes.informationPlanDeCompte
      && changes.donneesBudget.currentValue && changes.informationPlanDeCompte.currentValue) {
      this.refresh()
    }
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

    let isMediumOrLower = this.breakpointObserver.isMatched(mediumOrLower)

    let font_size = 20;
    let show_legend = !isMediumOrLower;
    let horizontal_positon = isMediumOrLower ? '50%' : '20%';

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
        orient: 'vertical',
        formatter: legend_formatter,
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
}
