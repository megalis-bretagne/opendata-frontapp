// https://schema.data.gouv.fr/scdl/budget/0.8.1/documentation.html
export interface LigneBudget {
    natdec: string, /** L'étape budgetaire */
    annee: number,
    nom: string, /** Nom de l'organisme concerné. */
    nature_label: string, /** Le 'quoi' (label) */
    fonction_label: string, /** Le 'pourquoi' */
    codrd: "0" | "1", /** Sens, recette: 0, dépense: 1 */
    mtreal: number, /** montant réalisé */

    // TODO: Données bidon juste pour tester les graphes / ui
    // Deviendra possiblement le ViewModel
    categorie: string,
    issouscategorie: boolean,
    libelle: string,
    montant: number,
}

export interface BudgetState {
    lignes: LigneBudget[],
    loading: boolean,
    error: boolean,
}

export const initialBudgetState: BudgetState = {
    lignes: [],
    loading: true,
    error: false,
}