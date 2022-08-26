import { Injectable } from "@angular/core";
import { TypeVue } from "../components/visualisations/budget-principal-graphe/budget-principal-graphe.component";
import { DonneesBudget, ReferencesFonctionnelles } from "../store/states/budget.state";

//
// TODO: Ici, gros du travail pour préparer la donnée à présenter
//       map reduce sur la fonction ou la nature
//

/**
 */
class NomenclatureFonctionnelle {

    referencesFonctionnelles: ReferencesFonctionnelles;

    constructor(referencesFonctionnelles: ReferencesFonctionnelles) {
        this.referencesFonctionnelles = referencesFonctionnelles
    }
    
    getReferencesDeNiveau(niveau: number) {
        return Object.entries(this.referencesFonctionnelles)
            .filter(([code, _]) => code.length == niveau)
    }

    nbNiveaux() {
        let niveaux = new Set<number>();
        for (const k of Object.keys(this.referencesFonctionnelles)) {
            niveaux.add(k.length);
        }
        return Math.max(...niveaux.values())
    }

    static niveauDuCode(code: string) {
        return code.length
    }
}

interface VisualisationPourDonut {
    total: number,
    prettyTotal: string,
    data: { value: number, name: string }[]
}

@Injectable()
export class PrepareDonneesVisualisation {

    nbCategorieMax = 10;
    formatter = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    })

    recettesPourDonut(
        donneesBudget: DonneesBudget,
        rd: 'recette' | 'depense',
        typeVue: TypeVue,
    ): VisualisationPourDonut {

        let referencesFonctionnelles = donneesBudget.references_fonctionnelles;
        let nomenclature = new NomenclatureFonctionnelle(referencesFonctionnelles);
        let mapped = new Map<string, number>()

        let nbNiveaux = nomenclature.nbNiveaux()
        let niveauAAffiche = 1 // Plus haut niveau
        if (typeVue == 'detaille')
            niveauAAffiche = nbNiveaux // Plus détaillé

        let expectRecette = rd == 'recette';

        let nbCategories = 0;
        let total = 0;

        for (var ligne of donneesBudget.lignes) {

            if (ligne.recette == expectRecette)
                continue;

            let refFonc = referencesFonctionnelles[ligne.fonction_code]
            let key = refFonc.libelle

            if (nbCategories >= this.nbCategorieMax)
                key = "Autres";

            if(!mapped.has(key))
                nbCategories += 1;

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