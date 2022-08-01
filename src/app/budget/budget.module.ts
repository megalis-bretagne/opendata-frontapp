import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetParametrageComponent } from './components/budget-parametrage/budget-parametrage.component';
import { MaterialModule } from '../shared/material.module';
import { BudgetRoutingModule } from './budget-routing.module';
import { StoreModule } from '@ngrx/store';
import { BudgetConsultationComponent } from './components/budget-consultation/budget-consultation.component';



@NgModule({
  declarations: [
    BudgetParametrageComponent,
    BudgetConsultationComponent
  ],
  imports: [
    CommonModule,

    MaterialModule,
    StoreModule.forFeature('budget', []),


    BudgetRoutingModule,
  ],
})
export class BudgetModule { }
