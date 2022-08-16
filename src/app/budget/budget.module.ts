import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { BudgetRoutingModule } from './budget-routing.module';
import { BUDGET_SERVICE_TOKEN, RealBudgetService } from './services/budget.service';
import { BudgetParametrageComponent } from './components/budget-parametrage/budget-parametrage.component';
import { BudgetParametrageNavComponent } from './components/budget-parametrage/budget-parametrage-nav/budget-parametrage-nav.component';
import { BudgetCardComponent } from './components/budget-card/budget-card.component';
import { BudgetStorageModule } from './store/budget-storage.module';

import * as echarts from 'echarts/core';
import { BarChart, PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';
import langFr from 'echarts/lib/i18n/langFR';
import { NgxEchartsModule } from 'ngx-echarts';
import { BudgetPrincipalGrapheComponent } from './components/visualisations/budget-principal-graphe/budget-principal-graphe.component';

echarts.use([
  TitleComponent, TooltipComponent, GridComponent, LegendComponent,
  BarChart, PieChart,
  SVGRenderer,
]);
echarts.registerLocale('FR', langFr);

@NgModule({
  declarations: [
    BudgetParametrageComponent,
    BudgetParametrageNavComponent,
    BudgetCardComponent,
    BudgetPrincipalGrapheComponent,
  ],
  imports: [
    CommonModule,

    NgxEchartsModule.forRoot({ echarts }),

    MaterialModule,
    BudgetStorageModule,

    BudgetRoutingModule,
  ],
  providers: [
    {
      provide: BUDGET_SERVICE_TOKEN,
      useClass: RealBudgetService,
    }
  ]
})
export class BudgetModule { }
