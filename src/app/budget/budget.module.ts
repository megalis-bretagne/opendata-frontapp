import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { BudgetRoutingModule } from './budget-routing.module';
import { StoreModule } from '@ngrx/store';
import { BUDGET_SERVICE_TOKEN, FakeBudgetService } from './services/budget.service';
import { BudgetParametrageComponent } from './components/budget-parametrage/budget-parametrage.component';
import { BudgetParametrageNavComponent } from './components/budget-parametrage/budget-parametrage-nav/budget-parametrage-nav.component';
import { BudgetCardComponent } from './components/budget-card/budget-card.component';
import { BudgetStorageModule } from './store/budget-storage.module';

@NgModule({
  declarations: [
    BudgetParametrageComponent,
    BudgetParametrageNavComponent,
    BudgetCardComponent,
  ],
  imports: [
    CommonModule,

    MaterialModule,
    BudgetStorageModule,

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
