import { createSelector } from "@ngrx/store";
import { DonneesBudgetairesDisponibles, _Etablissement } from "../../models/donnees-budgetaires-disponibles";
import { EtablissementComboItemViewModel, EtapeComboItemViewModel } from "../../models/view-models";
import { EtapeBudgetaire } from "../../services/budget.service";
import { extract_siren } from "../../services/siren.functions";
import { selectDonneesDisponibles } from "../states/budget.state";

function etablissement_pretty_name(etablissement: _Etablissement): string {
    let prettyName = etablissement.denomination
    if (etablissement.enseigne) {
        prettyName += `- ${etablissement.enseigne}`
    }
    return prettyName
}

function etablissement_vers_comboViewModel(etablissement: _Etablissement): EtablissementComboItemViewModel {
    let prettyName = etablissement_pretty_name(etablissement)
    return { value: etablissement.siret, viewValue: prettyName }
}

function etape_pretty_name(etape: EtapeBudgetaire): string {
    let prettyName = 'Étape inconnue'
    switch(etape) {
        case EtapeBudgetaire.BUDGET_PRIMITIF:
            return "Budget primitif";
        case EtapeBudgetaire.BUDGET_SUPPLEMENTAIRE:
            return "Budget supplémentaire";
        case EtapeBudgetaire.COMPTE_ADMINISTRATIF:
            return "Compte administratif";
        case EtapeBudgetaire.DECISION_MODIFICATIVE:
            return "Décision modificative";
        default:
            throw new Error(`${etape} non supportée`)
    }
}

export function etape_vers_comboViewModel(etape: EtapeBudgetaire): EtapeComboItemViewModel {
    return { value: etape, viewValue: etape_pretty_name(etape) }
}

export namespace BudgetViewModelSelectors {

    export namespace DonneesDisponibles {

        export const etablissementPrettyname = (siret: string) => {
            let siren = extract_siren(siret)
            return createSelector(
                selectDonneesDisponibles(siren),
                disponibles => {
                    if (!disponibles || !disponibles.infos_etablissements || !disponibles.infos_etablissements[siret])
                        return ''
                    let etablissement = disponibles.infos_etablissements[siret]
                    return etablissement_pretty_name(etablissement)
                }
            )
        }

        export const etablissementsDisponiblesComboViewModel = (siren: string) => createSelector(
            selectDonneesDisponibles(siren),
            disponibles => {
                if (!disponibles)
                    return []

                let infos_etab = disponibles.infos_etablissements;
                let sirets = Object.keys(infos_etab)

                return etablissementsComboViewModel(disponibles, sirets);
            }
        )

        // export const etablissementsDisponiblesComboViewModel = (siren: string, annee: string) => createSelector(
        //     selectDonneesDisponibles(siren),
        //     disponibles => {
        //         if (!disponibles) return []

        //         let ressources_disponibles = disponibles.ressources_disponibles;
        //         debugger;

        //         let sirets = Object.keys(ressources_disponibles[annee]);
        //         sirets.sort(sort_siret)

        //         return etablissementsComboViewModel(disponibles, sirets);
        //     }
        // )

        export const anneesDisponibles = (siren: string) => {
            return createSelector(
                selectDonneesDisponibles(siren),
                disponibles => {
                    if (!disponibles || !disponibles.ressources_disponibles) return []

                    let ressources_disponibles = disponibles.ressources_disponibles
                    let annees = Object.keys(ressources_disponibles)
                    return [...new Set(annees)].sort().reverse()
                }
            )
        }

        export const anneesDisponiblesPourEtablissement = (siret: string) => {

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

        // Utilities
        function etablissementsComboViewModel(donneesBudgetairesDisponibles: DonneesBudgetairesDisponibles, sirets: string[]): EtablissementComboItemViewModel[] {
            if (!donneesBudgetairesDisponibles || !donneesBudgetairesDisponibles.infos_etablissements) return [];

            let infos_etab = donneesBudgetairesDisponibles.infos_etablissements;
            let etabs = sirets.map(siret => infos_etab[siret]);
            let sorted = etabs.sort(sort_siret);
            let etabComboViewModel = sorted.map(etab => etablissement_vers_comboViewModel(etab));
            return etabComboViewModel;
        }

        function extraire_info_etablissement(donneesBudgetairesDisponibles: DonneesBudgetairesDisponibles, siret: string): _Etablissement {
            if (!donneesBudgetairesDisponibles || !donneesBudgetairesDisponibles.infos_etablissements) return null;
            return donneesBudgetairesDisponibles.infos_etablissements[siret]
        }

        const sort_siret = (s1, s2) => Number(s1) - Number(s2)
    }

}