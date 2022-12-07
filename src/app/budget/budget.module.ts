import { NgModule } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
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
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';
import langFr from 'echarts/lib/i18n/langFR';
import { NgxEchartsModule } from 'ngx-echarts';
import { VisualisationDonut } from './components/visualisations/visualisation-donut/visualisation-donut';
import { PrepareDonneesVisualisation } from './services/prepare-donnees-visualisation.service';
import { BudgetConsultationComponent } from './components/budget-consultation/budget-consultation.component';
import { PrettyCurrencyFormatter } from './services/pretty-currency-formatter';
import { LayoutModule } from '@angular/cdk/layout';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ReactiveFormsModule } from '@angular/forms';
import { GroupOfVisualisationsComponent } from './components/visualisations/group-of-visualisations/group-of-visualisations.component';
import { HttpClientModule } from '@angular/common/http';
import { ResizeObserverModule } from '@ng-web-apis/resize-observer';
import { TopTroisDepensesComponent } from './components/visualisations/top-trois-depenses/top-trois-depenses.component';
import { VisIframeDialogComponent } from './components/vis-iframe-dialog/vis-iframe-dialog.component';
import { EnConstructionComponent } from './components/en-construction/en-construction.component';
import { EditTitreDialogComponent } from './components/edit-titre-dialog/edit-titre-dialog.component';

echarts.use([
  TitleComponent, TooltipComponent, GridComponent, LegendComponent,
  BarChart, PieChart,
  SVGRenderer, CanvasRenderer,
]);
echarts.registerLocale('FR', langFr);

@NgModule({
  declarations: [
    BudgetParametrageComponent,
    BudgetParametrageNavComponent,
    BudgetCardComponent,
    VisualisationDonut,
    BudgetConsultationComponent,
    GroupOfVisualisationsComponent,
    TopTroisDepensesComponent,
    VisIframeDialogComponent,
    EnConstructionComponent,
    EditTitreDialogComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    LayoutModule,
    ClipboardModule,
    ResizeObserverModule,

    NgxEchartsModule.forRoot({ echarts }),

    MaterialModule,
    BudgetStorageModule,

    BudgetRoutingModule,
  ],
  providers: [
    Location,
    {
      provide: BUDGET_SERVICE_TOKEN,
      useClass: RealBudgetService,
    },
    PrepareDonneesVisualisation,
    PrettyCurrencyFormatter,
  ]
})
export class BudgetModule { }
