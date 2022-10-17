import { createFeatureSelector, createSelector } from "@ngrx/store"
import { EtapeBudgetaire } from "../../services/budget.service"
import { Pdc } from "../../models/plan-de-comptes"
import { DonneesBudgetairesDisponibles } from "../../models/donnees-budgetaires-disponibles"

export interface LigneBudget {
    fonction_code: string,
    compte_nature_code: string,
    recette: boolean,
    montant: number,
}

export interface DonneesBudgetaires {
    etape: EtapeBudgetaire,
    annee: number,
    siren: string,
    denomination_siege: string,
    lignes: [LigneBudget]
}

export interface BudgetState {

    donneesBudgetairesDisponibles: DonneesBudgetairesDisponibles,

    budgets: DonneesBudgetaires[],
    infoPlanDeComptes: Pdc.InformationPdc[],
    anneesDisponibles: number[],
    loading: boolean,
    error: boolean,
}

export const initialBudgetState: BudgetState = {

    donneesBudgetairesDisponibles: null,

    budgets: [],
    anneesDisponibles: [],
    infoPlanDeComptes: [],
    loading: true,
    error: false,
}

export const selectBudgetFeatureState = createFeatureSelector<BudgetState>('budget')

export const selectDonnees = (siren: string, annee: number, etape: EtapeBudgetaire) =>
    createSelector(selectBudgetFeatureState, (state) => {
        return state.budgets.find(budget =>
            (budget.annee == annee && budget.etape == etape && budget.siren == siren)
        )
    });

export const selectInformationsPlanDeCompte = (siren: string, annee: number) =>
    createSelector(selectBudgetFeatureState, (state) => {
        return state.infoPlanDeComptes.find(iPdc =>
            (iPdc.annee == annee && iPdc.siren == siren))
    });

export const selectReferencesFonctionnelles = (siren: string, annee: number) =>
    createSelector(selectInformationsPlanDeCompte(siren, annee), iPdc => iPdc.references_fonctionnelles)

export const selectComptesNature = (siren: string, annee: number) =>
    createSelector(selectInformationsPlanDeCompte(siren, annee), iPdc => iPdc.comptes_nature)

export const selectAnneesDisponibles = createSelector(
    selectBudgetFeatureState,
    (state) => state.anneesDisponibles,
)

export const selectBudgetError = createSelector(
    selectBudgetFeatureState,
    (state) => state.error
)

export const selectBudgetIsLoading = createSelector(
    selectBudgetFeatureState,
    (state) => state.loading
)