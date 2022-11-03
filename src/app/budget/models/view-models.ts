import { EtapeBudgetaire } from "../services/budget.service"

/** ViewModel pour une combo box */
export interface ComboItemViewModel<T> {
    value: T,
    viewValue: string,
}

/** siret - nom */
export type EtablissementComboItemViewModel = ComboItemViewModel<string>

/** etape - pretty name */
export type EtapeComboItemViewModel = ComboItemViewModel<EtapeBudgetaire>