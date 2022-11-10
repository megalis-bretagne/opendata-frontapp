import { Injectable } from "@angular/core";
import { TypeVue } from "../components/visualisations/budget-principal-graphe/budget-principal-graphe.component";
import { DonneesBudgetaires, LigneBudget } from "../models/donnees-budgetaires";
import { Pdc } from "../models/plan-de-comptes";
import { PrettyCurrencyFormatter } from "./pretty-currency-formatter";


export interface VisualisationPourDonut {
    total: number,
    prettyTotal: string,
    data: { value: number, name: string }[],
    data_dict: { [name: string]: number }
}

@Injectable()
export class PrepareDonneesVisualisation {

    constructor(private prettyCurrencyFormatter: PrettyCurrencyFormatter) { }

    donneesPourDonut(
        donneesBudget: DonneesBudgetaires, nomenclature: Pdc.Nomenclature,
        rd: 'recette' | 'depense', typeVue: TypeVue,
    ): VisualisationPourDonut {

        let extract_code = (ligne: LigneBudget) => ligne.fonction_code;
        if (nomenclature.type == "nature")
            extract_code = (ligne) => ligne.compte_nature_code;

        if (nomenclature.type == "fonctions")
            console.info(`On utilise une nomenclature fonctionnelle`);
        else if (nomenclature.type == "nature")
            console.info(`On utilise une nomenclature par nature`);

        let data_dict = {};
        let mapped = new Map<string, number>()

        let expectRecette = rd == 'recette';

        let total = 0;

        for (var ligne of donneesBudget.lignes) {

            if (ligne.recette == expectRecette)
                continue;

            let code = extract_code(ligne);
            let libelle = this._extraireLibelleCategoriePourLigne(code, nomenclature, typeVue);
            let key = libelle

            let previous = mapped.get(key) || 0
            let now = previous;
            let current = ligne.montant;

            now += current;
            total += current;

            now = this._truncate_2decimals(now);
            total = this._truncate_2decimals(total);

            mapped.set(key, now);
            data_dict[key] = now;
        }

        let data = [...mapped]
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);  // desc

        let prettyTotal = this.prettyCurrencyFormatter.format_as_title(total)

        return {
            total,
            prettyTotal,
            data, data_dict
        };
    }

    _extraireLibelleCategoriePourLigne(
        code: string,
        nomenclature: Pdc.Nomenclature,
        typeVue: TypeVue,
    ) {
        let elmtNomenclature = nomenclature.get(code)

        if (elmtNomenclature == null) {
            console.warn(`Impossible de récupérer la catégorie de code ${code} dans la nomenclature. Il sera catégorisé inconnu dans la visualisation.`);
            return "Inconnu";
        }

        if (typeVue == 'general')
            elmtNomenclature = nomenclature.getParentOuLuiMeme(elmtNomenclature)

        return elmtNomenclature.libelle;
    }

    _truncate_2decimals(x: number) {
        let truncated = Math.trunc(x * 100) / 100;
        return truncated;
    }
}