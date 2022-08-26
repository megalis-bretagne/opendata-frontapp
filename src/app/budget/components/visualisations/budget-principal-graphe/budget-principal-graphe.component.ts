import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { EChartsOption } from 'echarts';
import { BehaviorSubject } from 'rxjs';
import { PrepareDonneesVisualisation } from 'src/app/budget/services/prepare-donnees-visualisation.service';
import { DonneesBudget, InformationPlanDeCompte } from 'src/app/budget/store/states/budget.state';

export type TypeVue = 'general' | 'detaille'

@Component({
  selector: 'app-budget-principal-graphe',
  templateUrl: './budget-principal-graphe.component.html',
  styleUrls: ['./budget-principal-graphe.component.css']
})
export class BudgetPrincipalGrapheComponent implements OnInit, OnChanges {

  echartData$ = new BehaviorSubject({});
  typeVue: TypeVue = 'general'

  @Input()
  donneesBudget: DonneesBudget

  @Input()
  informationPlanDeCompte: InformationPlanDeCompte

  @Input()
  rd: 'recette' | 'depense';

  constructor(private mapper: PrepareDonneesVisualisation) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.donneesBudget && changes.informationPlanDeCompte) {
      this.refresh()
    }
  }

  toEchartsData(donneesBudget: DonneesBudget, informationPlanDeCompte: InformationPlanDeCompte, typeVue: TypeVue) {

    let donneesVisualisation = this.mapper.donneesPourDonut(donneesBudget, informationPlanDeCompte, this.rd, typeVue)
    let intitule = `Budget de \n ${donneesVisualisation.prettyTotal}`

    let chartOption: EChartsOption = {
      name: ``,
      tooltip: { trigger: 'item' },
      legend: {
        type: 'scroll',
        right: '5%',
        orient: 'vertical',
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          label: {
            position: 'center',
            fontSize: 20,
            formatter: () => "" + intitule
          },
          data: donneesVisualisation.data,
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

  refresh() {
      let chartData = this.toEchartsData(this.donneesBudget, this.informationPlanDeCompte, this.typeVue);
      this.echartData$.next(chartData)
  }
}
