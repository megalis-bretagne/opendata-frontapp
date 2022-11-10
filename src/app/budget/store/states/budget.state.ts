import { createFeatureSelector, createSelector } from "@ngrx/store"
import { Pdc } from "../../models/plan-de-comptes"
import { DonneesBudgetaires } from "../../models/donnees-budgetaires"
import { DonneesBudgetairesDisponibles } from "../../models/donnees-budgetaires-disponibles"
import { EtapeBudgetaire } from "../../models/etape-budgetaire"
import { Annee, Siren, Siret } from "../../models/common-types"


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

export const selectDonneesDisponibles = (siren: Siren) => createSelector(
    selectBudgetFeatureState,
    (state) => state.donneesBudgetairesDisponibles.find(disponibles => disponibles.siren == siren)
)

export const selectDonnees = (annee: Annee, siret: Siret, etape: EtapeBudgetaire) =>
    createSelector(selectBudgetFeatureState, (state) => {
        return state.budgets.find(budget =>
            (budget.annee == annee && budget.etape == etape && budget.siret == siret)
        )
    });

export const selectInformationsPlanDeCompte = (annee: Annee, siret: Siret) =>
    createSelector(selectBudgetFeatureState, (state) => {
        return state.infoPlanDeComptes.find(iPdc =>
            (iPdc.annee == annee && iPdc.siret == siret))
    });

export const selectReferencesFonctionnelles = (siren: Siren, annee: Annee) =>
    createSelector(selectInformationsPlanDeCompte(siren, annee), iPdc => iPdc.references_fonctionnelles)

export const selectComptesNature = (siren: Siren, annee: Annee) =>
    createSelector(selectInformationsPlanDeCompte(siren, annee), iPdc => iPdc.comptes_nature)

export const selectBudgetError = createSelector(
    selectBudgetFeatureState,
    (state) => state.error
)

export const selectBudgetIsLoading = createSelector(
    selectBudgetFeatureState,
    (state) => state.loading
)