import { Annee, Siret } from "./common-types";
import { EtapeBudgetaire } from "./etape-budgetaire";
import { VisualisationGraphId } from "./visualisation.model";

export interface DefaultVisualisationParametrageLocalisation {
    annee: Annee,
    siret: Siret,
    etape: EtapeBudgetaire,
    graphe_id: VisualisationGraphId,
}

export interface DefaultVisualisationParametrage {
    localisation: DefaultVisualisationParametrageLocalisation,
    
    titre: string,
    sous_titre: string,
}