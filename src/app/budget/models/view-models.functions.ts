import { Siret } from "./common-types";
import { DonneesBudgetairesDisponibles, Etablissement } from "./donnees-budgetaires-disponibles"
import { EtapeBudgetaire } from "./etape-budgetaire";
import { EtablissementComboItemViewModel, EtapeComboItemViewModel } from "./view-models";

export function etablissement_pretty_name(etablissement: Etablissement): string {
    let prettyName = etablissement.denomination
    if (etablissement.enseigne) {
        prettyName += `- ${etablissement.enseigne}`
    }
    return prettyName
}

export function etape_pretty_name(etape: EtapeBudgetaire): string {
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

export function etablissement_vers_comboViewModel(etablissement: Etablissement, disabled?: boolean): EtablissementComboItemViewModel {
    let prettyName = etablissement_pretty_name(etablissement)
    return { value: etablissement.siret, viewValue: prettyName, disabled: Boolean(disabled) }
}

export function etablissements_vers_comboViewModel(
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

export function etape_vers_comboViewModel(etape: EtapeBudgetaire, disabled?: boolean): EtapeComboItemViewModel {

    return { value: etape, viewValue: etape_pretty_name(etape), disabled: Boolean(disabled) }
}

const sort_siret = (s1, s2) => Number(s1) - Number(s2)