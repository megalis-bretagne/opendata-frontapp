import { Injectable } from "@angular/core";
import { TypeVue } from "../components/visualisations/budget-principal-graphe/budget-principal-graphe.component";
import { DonneesBudget, InformationPlanDeCompte, ReferenceFonctionnelle, ReferencesFonctionnelles } from "../store/states/budget.state";

//
// TODO: Ici, gros du travail pour préparer la donnée à présenter
//       map reduce sur la fonction ou la nature
//

/** */
class NomenclatureFonctionnelle {

    referencesFonctionnelles: ReferencesFonctionnelles;

    constructor(referencesFonctionnelles: ReferencesFonctionnelles) {
        this.referencesFonctionnelles = referencesFonctionnelles
    }
    
    getParentOuLuiMeme(ref: ReferenceFonctionnelle) {
        let _ref = ref
        while(_ref.parent_code) {
            _ref = this.referencesFonctionnelles[_ref.parent_code]
        }
        return _ref
    }

    get(code: string) {
        return this.referencesFonctionnelles[code];
    }
}

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
        informationPlanDeCompte: InformationPlanDeCompte,
        rd: 'recette' | 'depense',
        typeVue: TypeVue,
    ): VisualisationPourDonut {

        let referencesFonctionnelles = informationPlanDeCompte.references_fonctionnelles;
        let nomenclature = new NomenclatureFonctionnelle(referencesFonctionnelles);
        let mapped = new Map<string, number>()

        let expectRecette = rd == 'recette';

        let total = 0;

        for (var ligne of donneesBudget.lignes) {

            if (ligne.recette == expectRecette)
                continue;
            
            let code = ligne.fonction_code;
            let refFonc = nomenclature.get(code)
            if (typeVue == 'general')
                refFonc = nomenclature.getParentOuLuiMeme(refFonc)

            let key = refFonc.libelle

            let previous = mapped.get(key) || 0
            let now = previous;

            now += ligne.montant;
            total += ligne.montant

            mapped.set(key, now);
        }

        let data = [...mapped]
            .map(([name, value]) => ({name, value}))
            .sort((a, b) => b.value - a.value);  // desc

        let prettyTotal = this.formatter.format(total)

        return {
            total,
            prettyTotal,
            data,
        };
    }
}