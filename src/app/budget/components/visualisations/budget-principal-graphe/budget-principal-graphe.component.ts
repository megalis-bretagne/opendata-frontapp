import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { EChartsOption } from 'echarts';
import { BehaviorSubject } from 'rxjs';
import { Pdc } from 'src/app/budget/models/plan-de-comptes';
import { PrepareDonneesVisualisation } from 'src/app/budget/services/prepare-donnees-visualisation.service';
import { PrettyCurrencyFormatter } from 'src/app/budget/services/pretty-currency-formatter';
import { DonneesBudget } from 'src/app/budget/store/states/budget.state';

export type TypeVue = 'general' | 'detaille'

@Component({
  selector: 'app-budget-principal-graphe',
  templateUrl: './budget-principal-graphe.component.html',
  styleUrls: ['./budget-principal-graphe.component.css']
})
export class BudgetPrincipalGrapheComponent implements OnInit, OnChanges {

  echartData$ = new BehaviorSubject({});
  typeVue: TypeVue = 'general'
  typeNomenclature: Pdc.TypeNomenclature = "fonctions"

  @Input()
  donneesBudget: DonneesBudget

  @Input()
  informationPlanDeCompte: Pdc.InformationPdc

  @Input()
  rd: 'recette' | 'depense';

  constructor(private mapper: PrepareDonneesVisualisation, private prettyCurrencyFormatter: PrettyCurrencyFormatter) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.donneesBudget && changes.informationPlanDeCompte) {
      this.refresh()
    }
  }

  toEchartsData(donneesBudget: DonneesBudget, informationPlanDeCompte: Pdc.InformationPdc, typeVue: TypeVue) {

    let nomenclature = Pdc.extraire_nomenclature(informationPlanDeCompte, this.typeNomenclature)

    let donneesVisualisation = this.mapper.donneesPourDonut(donneesBudget, nomenclature, this.rd, typeVue)

    let data_dict = donneesVisualisation.data_dict;
    let data = donneesVisualisation.data;

    let intitule = `Budget de \n {b|${donneesVisualisation.prettyTotal}}`

    let font_size = 20;

    let chartOption: EChartsOption = {
      name: ``,
      tooltip: { 
        trigger: 'item',
        formatter: (item) => `${item.name}: <b> ${this.prettyCurrencyFormatter.format(item.value)}</b>`,
      },
      legend: {
        type: 'scroll',
        right: '5%',
        orient: 'vertical',
        formatter: (name) => `${name} - ${this.prettyCurrencyFormatter.format(data_dict[name])}`
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
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
    let chartInitOptions = {}

    let chartData = {
      options: chartOption,
      chartInitOptions,
    }

    return chartData;
  }

  onClicVueGenerale() {
    this.typeVue = 'general';
    this.refresh()
  }

  onClicVueDetaille() {
    this.typeVue = 'detaille';
    this.refresh()
  }

  onClicNomenclatureFonctions() {
    this.typeNomenclature = "fonctions";
    this.refresh()
  }

  onClicNomenclatureNature() {
    this.typeNomenclature = "nature";
    this.refresh()
  }

  refresh() {
      let chartData = this.toEchartsData(this.donneesBudget, this.informationPlanDeCompte, this.typeVue);
      this.echartData$.next(chartData)
  }
}
