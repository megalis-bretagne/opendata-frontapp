import { Injectable } from "@angular/core";
import { TypeVue } from "../components/visualisations/budget-principal-graphe/budget-principal-graphe.component";
import { Pdc } from "../models/plan-de-comptes";
import { DonneesBudget, LigneBudget } from "../store/states/budget.state";


interface VisualisationPourDonut {
    total: number,
    prettyTotal: string,
    data: { value: number, name: string }[]
}

@Injectable()
export class PrepareDonneesVisualisation {

    formatter = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    })

    donneesPourDonut(
        donneesBudget: DonneesBudget,
        nomenclature: Pdc.Nomenclature,
        rd: 'recette' | 'depense',
        typeVue: TypeVue,
    ): VisualisationPourDonut {

        let extract_code = (ligne: LigneBudget) => ligne.fonction_code;
        if (nomenclature.type == "nature")
            extract_code = (ligne) => ligne.compte_nature_code;
        
        if (nomenclature.type == "fonctions")
            console.info(`On utilise une nomenclature fonctionnelle`);
        else if(nomenclature.type == "nature")
            console.info(`On utilise une nomenclature par nature`);

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

            now += ligne.montant;
            total += ligne.montant

            mapped.set(key, now);
        }

        let data = [...mapped]
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);  // desc

        let prettyTotal = this.formatter.format(total)

        return {
            total,
            prettyTotal,
            data,
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
}