import { createFeatureSelector, createSelector } from "@ngrx/store"
import { EtapeBudgetaire } from "../../services/budget.service"
import { Pdc } from "../../models/plan-de-comptes"
import { Annee, DonneesBudgetairesDisponibles, Siret } from "../../models/donnees-budgetaires-disponibles"

export interface LigneBudget {
    fonction_code: string,
    compte_nature_code: string,
    recette: boolean,
    montant: number,
}

export interface DonneesBudgetaires {
    annee: Annee,
    siret: Siret,
    etape: EtapeBudgetaire,
    lignes: [LigneBudget]
}

export interface BudgetState {

    donneesBudgetairesDisponibles: DonneesBudgetairesDisponibles[],

    budgets: DonneesBudgetaires[],
    infoPlanDeComptes: Pdc.InformationPdc[],
    
    loading: boolean,
    error: boolean,
}

export const initialBudgetState: BudgetState = {

    donneesBudgetairesDisponibles: [],

    budgets: [],
    infoPlanDeComptes: [],
    loading: true,
    error: false,
}

export const selectBudgetFeatureState = createFeatureSelector<BudgetState>('budget')

export const selectDonneesDisponibles = (siren: string) => createSelector(
    selectBudgetFeatureState,
    (state) => state.donneesBudgetairesDisponibles.find(disponibles => disponibles.siren == siren)
)

export const selectDonnees = (annee: string, siret: string, etape: EtapeBudgetaire) =>
    createSelector(selectBudgetFeatureState, (state) => {
        return state.budgets.find(budget =>
            (budget.annee == annee && budget.etape == etape && budget.siret == siret)
        )
    });

export const selectInformationsPlanDeCompte = (annee: string, siret: string) =>
    createSelector(selectBudgetFeatureState, (state) => {
        return state.infoPlanDeComptes.find(iPdc =>
            (iPdc.annee == annee && iPdc.siret == siret))
    });

export const selectReferencesFonctionnelles = (siren: string, annee: string) =>
    createSelector(selectInformationsPlanDeCompte(siren, annee), iPdc => iPdc.references_fonctionnelles)

export const selectComptesNature = (siren: string, annee: string) =>
    createSelector(selectInformationsPlanDeCompte(siren, annee), iPdc => iPdc.comptes_nature)

export const selectBudgetError = createSelector(
    selectBudgetFeatureState,
    (state) => state.error
)

export const selectBudgetIsLoading = createSelector(
    selectBudgetFeatureState,
    (state) => state.loading
)