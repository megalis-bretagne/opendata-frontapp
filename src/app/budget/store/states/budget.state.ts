import { createFeatureSelector, createSelector } from "@ngrx/store"
import { EtapeBudgetaire } from "../../services/budget.service"

export interface ReferenceFonctionnelle {
    code: string,
    libelle: string
}

export interface LigneBudget {
    fonction_code: string,
    recette: boolean,
    montant: number,
}

export interface DonneesBudget {
    etape: EtapeBudgetaire,
    annee: number,
    siren: number,
    denomination_siege: string,
    references_fonctionnelles: {
        [code: string]: ReferenceFonctionnelle
    },
    lignes: [LigneBudget]
}

export interface BudgetState {
    budgets: DonneesBudget[]
    anneesDisponibles: number[],
    loading: boolean,
    error: boolean,
}

export const initialBudgetState: BudgetState = {
    budgets: [],
    anneesDisponibles: [],
    loading: true,
    error: false,
}

export const selectBudgetFeatureState = createFeatureSelector<BudgetState>('budget')

export const selectDonnees = (siren: number, etape: EtapeBudgetaire, annee: number) =>
    createSelector(selectBudgetFeatureState, (state) => {
        return state.budgets.find(budget =>
            (budget.annee == annee && budget.etape == etape && budget.siren == siren)
        )
    });

export const selectReferencesFonctionnelles = (siren: number, annee: number) =>
    createSelector(selectBudgetFeatureState, (state) => {
        // Les références fonctionnelles proviennent du plan de compte, on peut donc
        // ignorer l'étape budgetaire lors de leur identification.
        return state.budgets.find(budget =>
            (budget.annee == annee && budget.siren == siren && budget.references_fonctionnelles)
        )
            .references_fonctionnelles
    });

export const selectAnneesDisponibles = createSelector(
    selectBudgetFeatureState,
    (state) => state.anneesDisponibles,
)

export const selectBudgetError = createSelector(
    selectBudgetFeatureState,
    (state) => state.error
)