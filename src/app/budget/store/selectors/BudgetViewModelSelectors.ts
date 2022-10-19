import { createSelector } from "@ngrx/store";
import { _Etablissement } from "../../models/donnees-budgetaires-disponibles";
import { EtablissementComboItemViewModel } from "../../models/view-models";
import { extract_siren } from "../../services/siren.functions";
import { selectDonneesDisponibles } from "../states/budget.state";

function etablissement_vers_comboViewModel(etablissement: _Etablissement): EtablissementComboItemViewModel {
    let prettyName = etablissement.denomination
    if (etablissement.enseigne) {
        prettyName += `- ${etablissement.enseigne}`
    }
    return { value: etablissement.siret, viewValue: prettyName }
}


export namespace BudgetViewModelSelectors {

    export namespace DonneesDisponibles {

        export const etablissementsDisponiblesComboViewModel = (siren: string) => createSelector(
            selectDonneesDisponibles(siren),
            disponibles => {
                if (!disponibles)
                    return []

                let infos_etab = disponibles.infos_etablissements;
                let sirets = Object.keys(infos_etab)
                let etabs = sirets.map(siret => infos_etab[siret])
                let sorted = etabs.sort((e1, e2) => Number(e1.siret) - Number(e2.siret))
                let etabsComboViewModel = sorted.map(etab => etablissement_vers_comboViewModel(etab))
                return etabsComboViewModel;
            }
        )

        export const anneesDisponibles = (siret: string) => {

            let siren = extract_siren(siret);

            return createSelector(
                selectDonneesDisponibles(siren),
                disponibles => {
                    let ressources_disponibles = disponibles.ressources_disponibles
                    if (!ressources_disponibles)
                        return []
                    
                    let annees = Object.keys(ressources_disponibles)

                    let anneesDisponibles = []
                    for (const annee of annees) {
                        let sirets = Object.keys(ressources_disponibles[annee])
                        if (sirets.includes(siret))
                            anneesDisponibles.push(annee)
                    }

                    return [...new Set(anneesDisponibles)].sort().reverse()
                }
            )
        }
    }

}