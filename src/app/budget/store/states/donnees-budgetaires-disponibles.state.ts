import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { DonneesBudgetairesDisponibles } from "../../models/donnees-budgetaires-disponibles";
import { CallStates } from "./call-states";

export interface DonneesBudgetairesDisponiblesState extends EntityState<DonneesBudgetairesDisponibles> {
    callStates: CallStates
}

export const donneesBudgetairesDisponiblesAdapter : EntityAdapter<DonneesBudgetairesDisponibles> = createEntityAdapter<DonneesBudgetairesDisponibles>({
    selectId: (disponibles) => disponibles.siren 
})

export const initialDonneesBudgetairesDisponiblesState: DonneesBudgetairesDisponiblesState = donneesBudgetairesDisponiblesAdapter.getInitialState({ 
    callStates: {},
})
