import { EtapeBudgetaire } from "./etape-budgetaire"

/** ViewModel pour une combo box */
export interface ComboItemViewModel<T> {
    value: T,
    viewValue: string,
    disabled: boolean,
}

/** siret - nom */
export type EtablissementComboItemViewModel = ComboItemViewModel<string>

/** etape - pretty name */
export type EtapeComboItemViewModel = ComboItemViewModel<EtapeBudgetaire>


export interface VisualisationTitres {
    titre: string,
    sous_titre: string,
}