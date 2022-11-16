import { createSelector } from "@ngrx/store";
import { extract_siren, Siret } from "../../models/common-types";
import { etablissement_pretty_name } from "../../models/view-models.functions";
import { selectDonneesBudgetairesDisponiblesPour } from "./donnees-budgetaires-disponibles.selectors";

export namespace BudgetViewModelSelectors {

    export namespace DonneesDisponibles {

        export const etablissementPrettyname = (siret: Siret) => {
            let siren = extract_siren(siret)
            return createSelector(
                selectDonneesBudgetairesDisponiblesPour(siren),
                disponibles => {
                    if (!disponibles || !disponibles.infos_etablissements || !disponibles.infos_etablissements[siret])
                        return ''
                    let etablissement = disponibles.infos_etablissements[siret]
                    return etablissement_pretty_name(etablissement)
                }
            )
        }
    }

}