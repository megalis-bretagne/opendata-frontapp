import { EtapeBudgetaire } from "../../services/budget.service";
import { IdentifiantVisualisation, VisualisationUtils } from "./visualisation.model"

describe('pour deux Identifiants de visualisation similaires', () => {
   
    let idViz_0: IdentifiantVisualisation = { 
        annee: '2020',
        siret: 'siret1',
        etape: EtapeBudgetaire.COMPTE_ADMINISTRATIF,
        graphe_id: 'budget-principal-depenses',
    };
    let idViz_1: IdentifiantVisualisation = { 
        annee: '2020',
        siret: 'siret1',
        etape: EtapeBudgetaire.COMPTE_ADMINISTRATIF,
        graphe_id: 'budget-principal-depenses',
    };

    it('_eq doit retourner vrai', () => {
        let isEqual = VisualisationUtils._eq(idViz_0, idViz_1)
        expect(isEqual).toBeTrue()
    });

    it('unique doit retourner un tableau de taille 1', () => {
        let unique = VisualisationUtils.distinct([idViz_0, idViz_1])
        expect(unique.length).toBe(1)
    })
})

describe('pour deux Identifiants de visualisation differents', () => {
   
    let idViz_a: IdentifiantVisualisation = { 
        annee: '2020',
        siret: 'siret1',
        etape: EtapeBudgetaire.COMPTE_ADMINISTRATIF,
        graphe_id: 'budget-principal-depenses',
    };
    let idViz_b: IdentifiantVisualisation = { 
        annee: '2021',
        siret: 'siret1',
        etape: EtapeBudgetaire.COMPTE_ADMINISTRATIF,
        graphe_id: 'budget-principal-depenses',
    };

    it('_eq doit retourner faux', () => {
        let isEqual = VisualisationUtils._eq(idViz_a, idViz_b)
        expect(isEqual).toBeFalse()
    });

    it('unique doit retourner un tableau de taille 2', () => {
        let unique = VisualisationUtils.distinct([idViz_a, idViz_b])
        expect(unique.length).toBe(2)
    })
})