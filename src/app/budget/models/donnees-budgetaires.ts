import { Annee, Siret } from "./common-types";
import { EtapeBudgetaire } from "./etape-budgetaire";

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