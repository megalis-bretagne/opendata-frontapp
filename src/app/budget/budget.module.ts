import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { BudgetRoutingModule } from './budget-routing.module';
import { StoreModule } from '@ngrx/store';
import { BUDGET_SERVICE_TOKEN, FakeBudgetService } from './services/budget.service';
import { BudgetParametrageComponent } from './components/budget-parametrage/budget-parametrage.component';
import { BudgetParametrageNavComponent } from './components/budget-parametrage/budget-parametrage-nav/budget-parametrage-nav.component';

@NgModule({
  declarations: [
    BudgetParametrageComponent,
    BudgetParametrageNavComponent,
  ],
  imports: [
    CommonModule,

    MaterialModule,
    StoreModule.forFeature('budget', []),

    BudgetRoutingModule,
  ],
  providers: [
    {
      provide: BUDGET_SERVICE_TOKEN,
      useClass: FakeBudgetService, // TODO: Using fake service, replace
    }
  ]
})
export class BudgetModule { }
