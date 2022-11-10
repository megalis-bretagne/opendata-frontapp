import { EtapeBudgetaire } from "../services/budget.service";
import { Annee, Siret } from "./donnees-budgetaires-disponibles";

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