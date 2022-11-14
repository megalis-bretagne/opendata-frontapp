import * as donnees_budgetaires_json from 'cypress/fixtures/donnees_budgetaires.example.json';
import * as info_pdc_json from 'cypress/fixtures/infos_pdc.example.json';

import { DonneesBudgetaires } from "src/app/budget/models/donnees-budgetaires"
import { Pdc } from "src/app/budget/models/plan-de-comptes"

export function exemple_donnees_budgetaires(): DonneesBudgetaires {
    return poor_man_clone(donnees_budgetaires_json) as DonneesBudgetaires
}


export function exemple_infos_pdc(): Pdc.InformationPdc {
    return poor_man_clone(info_pdc_json) as Pdc.InformationPdc
}

function poor_man_clone(json) {
    let stringify = JSON.stringify(json)
    return JSON.parse(stringify)
}