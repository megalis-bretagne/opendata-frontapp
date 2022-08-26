import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { BudgetState } from 'src/app/budget/store/states/budget.state';

export type TypeVue = 'general' | 'detaille'

@Component({
  selector: 'app-budget-principal-graphe',
  templateUrl: './budget-principal-graphe.component.html',
  styleUrls: ['./budget-principal-graphe.component.css']
})
export class BudgetPrincipalGrapheComponent implements OnInit {

  echartData$;
  private _typeVue = new BehaviorSubject<TypeVue>('general')

  constructor(private store: Store<BudgetState>) { }

  ngOnInit(): void { }

  // ngOnInit(): void {

  //   let lignes$ = this.store.pipe(select(selectLignesBudget))
  //   this.echartData$ = lignes$.pipe(
  //     map(this.toEchartsData)
  //   )
  // }

  // toEchartsData(lignes: LigneBudget[]) {

  //   let values = lignes.map(ligne => ligne.montant);
  //   let montant = values.reduce((acc, v) => acc + v, 0);
  //   let intitule = `Budget de \n ${montant}€`;
  //   let data = lignes.map(ligne => { 
  //     return { value: 10, name: ligne.nature };
  //     // return { value: ligne.montant, name: ligne.nature };
  //   })
  //   let chartOption: EChartsOption = {
  //     name: ``,
  //     tooltip: { trigger: 'item' },
  //     legend: {
  //       right: '5%',
  //       orient: 'vertical',
  //     },
  //     series: [
  //       {
  //         type: 'pie',
  //         radius: ['40%', '70%'],
  //         label: {
  //           position: 'center',
  //           fontSize: 20,
  //           formatter: () => intitule
  //         },
  //         data: data
  //       }
  //     ]
  //   };
  //   let chartInitOptions = {
  //     // width: 800,
  //     // height: 600,
  //   }

  //   return {
  //     options: chartOption,
  //     initOptions: chartInitOptions,
  //   };
  // }

}
