import { createSelector } from "@ngrx/store";
import { Annee, Siret } from "../../models/common-types";
import { DonneesBudgetairesDisponibles, Etablissement, donnees_budgetaires_disponibles_etapes, donnees_budgetaires_disponibles_sirets } from "../../models/donnees-budgetaires-disponibles";
import { EtapeBudgetaire } from "../../models/etape-budgetaire";
import { EtablissementComboItemViewModel, EtapeComboItemViewModel } from "../../models/view-models";
import { extract_siren } from "../../services/siren.functions";
import { selectDonneesDisponibles } from "../states/budget.state";

function etablissement_pretty_name(etablissement: Etablissement): string {
    let prettyName = etablissement.denomination
    if (etablissement.enseigne) {
        prettyName += `- ${etablissement.enseigne}`
    }
    return prettyName
}

function etablissement_vers_comboViewModel(etablissement: Etablissement, disabled?: boolean): EtablissementComboItemViewModel {
    let prettyName = etablissement_pretty_name(etablissement)
    return { value: etablissement.siret, viewValue: prettyName, disabled: Boolean(disabled) }
}

function etape_pretty_name(etape: EtapeBudgetaire): string {
    switch (etape) {
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

export function etape_vers_comboViewModel(etape: EtapeBudgetaire, disabled?: boolean): EtapeComboItemViewModel {

    return { value: etape, viewValue: etape_pretty_name(etape), disabled: Boolean(disabled) }
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

        export const etablissementsDisponiblesComboViewModel = (siren: string, annee?: Annee) => createSelector(
            selectDonneesDisponibles(siren),
            disponibles => {
                if (!disponibles)
                    return []

                let tous_sirets = donnees_budgetaires_disponibles_sirets(disponibles)
                let sirets_actifs = donnees_budgetaires_disponibles_sirets(disponibles, annee)

                return etablissementsComboViewModel(disponibles, tous_sirets, sirets_actifs);
            }
        )

        export const etapesDisponiblesComboViewModel = (siren: string, annee?: Annee, siret?: Siret) => createSelector(
            selectDonneesDisponibles(siren),
            disponibles => {
                if (!disponibles) return []

                let all_etapes = Object.values(EtapeBudgetaire)
                let etapes_disponibles = donnees_budgetaires_disponibles_etapes(disponibles, annee, siret)

                let etapesvm = all_etapes.map(e => {
                    let disabled = !etapes_disponibles.includes(e)
                    return etape_vers_comboViewModel(e, disabled)
                });

                return etapesvm;
            }
        )

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
        function etablissementsComboViewModel(
            donneesBudgetairesDisponibles: DonneesBudgetairesDisponibles,
            tous_sirets: Siret[],
            sirets_actifs: Siret[],
        ): EtablissementComboItemViewModel[] {
            if (!donneesBudgetairesDisponibles || !donneesBudgetairesDisponibles.infos_etablissements) return [];

            let infos_etab = donneesBudgetairesDisponibles.infos_etablissements;
            let etabs = tous_sirets.map(siret => infos_etab[siret]);
            let sorted = etabs.sort(sort_siret);
            let etabComboViewModel = sorted.map(etab => {
                let disabled = !sirets_actifs.includes(etab.siret)
                return etablissement_vers_comboViewModel(etab, disabled)
            }
            );
            return etabComboViewModel;
        }

        const sort_siret = (s1, s2) => Number(s1) - Number(s2)
    }

}