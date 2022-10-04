import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { BudgetEffects } from "./effects/budget.effects";
import { budgetReducer } from "./reducers/budget.reducer";

@NgModule({
    imports: [
        StoreModule.forFeature('budget', budgetReducer),
        EffectsModule.forFeature([BudgetEffects]),
    ],
    exports: [StoreModule]
})
export class BudgetStorageModule {}