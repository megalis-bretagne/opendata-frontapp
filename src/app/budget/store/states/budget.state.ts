import { createFeatureSelector, createSelector } from "@ngrx/store"

export interface LigneBudget {
    annee: number,
    etape: 'budget primitif' | 'budget supplémentaire' | 'décision modificative' | 'compte administratif'
    nom: string,
    nature: string,
    fonction: string,

    montant: number,
}

export interface BudgetState {
    lignes: LigneBudget[],
    anneesDisponibles: number[],
    loading: boolean,
    error: boolean,
}

export const initialBudgetState: BudgetState = {
    lignes: [],
    anneesDisponibles: [],
    loading: true,
    error: false,
}

export const selectBudgetFeatureState = createFeatureSelector<BudgetState>('budget')
export const selectLignesBudget = createSelector(
    selectBudgetFeatureState,
    (state) => state.lignes,
)

export const selectAnneesDisponibles = createSelector(
    selectBudgetFeatureState,
    (state) => state.anneesDisponibles,
)

export const selectBudgetError = createSelector(
    selectBudgetFeatureState,
    (state) => state.error
)