import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { BudgetEffects } from "./effects/budget.effects";
import { donneesBudgetairesDisponiblesReducer } from "./reducers/donnees-budgetaires-disponibles.reducer";
import { donneesBudgetairesReducer } from "./reducers/donnees-budgetaires.reducer";
import { informationsPdcReducer } from "./reducers/informations-pdc.reducer";

@NgModule({
    imports: [
        StoreModule.forFeature('donneesBudgetairesDisponibles', donneesBudgetairesDisponiblesReducer),
        StoreModule.forFeature('donneesBudgetaires', donneesBudgetairesReducer),
        StoreModule.forFeature('informationsPdc', informationsPdcReducer),
        EffectsModule.forFeature([BudgetEffects]),
    ],
    exports: [StoreModule]
})
export class BudgetStorageModule {}