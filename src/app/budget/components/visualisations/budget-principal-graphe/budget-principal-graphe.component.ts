import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { EChartsOption } from 'echarts';
import { BehaviorSubject } from 'rxjs';
import { PrepareDonneesVisualisation } from 'src/app/budget/services/prepare-donnees-visualisation.service';
import { DonneesBudget } from 'src/app/budget/store/states/budget.state';

export type TypeVue = 'general' | 'detaille'

@Component({
  selector: 'app-budget-principal-graphe',
  templateUrl: './budget-principal-graphe.component.html',
  styleUrls: ['./budget-principal-graphe.component.css']
})
export class BudgetPrincipalGrapheComponent implements OnInit, OnChanges {

  echartData$ = new BehaviorSubject({});
  private _typeVue$ = new BehaviorSubject<TypeVue>('general')

  @Input()
  donneesBudget: DonneesBudget

  @Input()
  rd: 'recette'|'depense';

  __cpt = 0

  constructor(private mapper: PrepareDonneesVisualisation) { }

  ngOnInit(): void { 

  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes.donneesBudget) {
        let chartData = this.toEchartsData(this.donneesBudget)
        this.echartData$.next(chartData)
      }
  }

  toEchartsData(donneesBudget: DonneesBudget) {

    let donneesVisualisation = this.mapper.recettesPourDonut(donneesBudget, this.rd, "general")
    let intitule = `Budget de \n ${donneesVisualisation.prettyTotal}`

    let chartOption: EChartsOption = {
      name: ``,
      tooltip: { trigger: 'item' },
      legend: {
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
            formatter: () => ""+intitule
          },
          data: donneesVisualisation.data,
        }
      ]
    };
    let chartInitOptions = { }

    let chartData =  {
      options: chartOption,
      chartInitOptions,
    }

    return chartData;
  }
}
