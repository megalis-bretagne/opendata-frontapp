/** ViewModel pour une combo box */
export interface ComboItemViewModel<T> {
    value: T,
    viewValue: string,
}

/** siret - nom */
export type EtablissementComboItemViewModel = ComboItemViewModel<string>