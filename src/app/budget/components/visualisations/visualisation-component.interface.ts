import { DonneesBudgetaires } from "../../models/donnees-budgetaires";
import { Pdc } from "../../models/plan-de-comptes";
import { EchartsViewModel } from "./EchartsViewModel";

export interface VisualisationComponent {
    /** Le viewmodel courant*/
    echartsVm?: EchartsViewModel

    /** Transforme les données budgetaires brutes en view model pour echarts*/
    toChartsViewModel(donnees: DonneesBudgetaires, pdc: Pdc.InformationsPdc): EchartsViewModel

    /** Appellé pour rafraichir le graphe*/
    refresh()
}