import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { DefaultVisualisationParametragesEffects } from "./effects/default-visualisation-parametrages.effects";
import { DonneesBudgetairesDisponiblesEffects } from "./effects/donnees-budgetaires-disponibles.effects";
import { DonneesBudgetairesEffects } from "./effects/donnees-budgetaires.effects";
import { InformationsPdcEffects } from "./effects/informations-pdc.effects";
import { defaultVisualisationParametrageReducer } from "./reducers/default-visualisation-parametrages.reducer";
import { donneesBudgetairesDisponiblesReducer } from "./reducers/donnees-budgetaires-disponibles.reducer";
import { donneesBudgetairesReducer } from "./reducers/donnees-budgetaires.reducer";
import { informationsPdcReducer } from "./reducers/informations-pdc.reducer";

@NgModule({
    imports: [
        StoreModule.forFeature('defaultVisualisationParametrages', defaultVisualisationParametrageReducer),
        StoreModule.forFeature('donneesBudgetairesDisponibles', donneesBudgetairesDisponiblesReducer),
        StoreModule.forFeature('donneesBudgetaires', donneesBudgetairesReducer),
        StoreModule.forFeature('informationsPdc', informationsPdcReducer),
        EffectsModule.forFeature([
            DonneesBudgetairesEffects,
            DonneesBudgetairesDisponiblesEffects,
            InformationsPdcEffects,
            DefaultVisualisationParametragesEffects,
        ]),
    ],
    exports: [StoreModule]
})
export class BudgetStorageModule { }