import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { combineLatest } from "rxjs";
import { Annee, Siren, Siret } from "../models/common-types";
import { EtapeBudgetaire } from "../models/etape-budgetaire";
import { BudgetDisponiblesInitAction } from "../store/actions/donnees-budgetaires-disponibles.actions";
import { DonnneesBudgetairesInitAction } from "../store/actions/donnees-budgetaires.actions";
import { InformationsPdcInitAction } from "../store/actions/informations-pdc.actions";
import { BudgetViewModelSelectors } from "../store/selectors/BudgetViewModelSelectors";
import { selectDonneesBudgetairesDisponiblesCallStatePour, selectDonneesBudgetairesDisponiblesPour } from "../store/selectors/donnees-budgetaires-disponibles.selectors";
import { selectDonneesBudgtetairesCallStatePour, selectDonneesPour } from "../store/selectors/donnees-budgetaires.selectors";
import { selectInformationsPdcPour } from "../store/selectors/informations-pdc.selectors";
import { DonneesBudgetairesDisponiblesState } from "../store/states/donnees-budgetaires-disponibles.state";
import { DonneesBudgetairesState } from "../store/states/donnees-budgetaires.state";
import { InformationsPdcState } from "../store/states/informations-pdc.state";

@Injectable({
    providedIn: 'root'
})
export class BudgetsStoresService {
    constructor(
        private donneesBudgetairesDisponiblesStore: Store<DonneesBudgetairesDisponiblesState>,
        private donneesBudgetairesStore: Store<DonneesBudgetairesState>,
        private informationsPdcStore: Store<InformationsPdcState>,
        ) { }

    load_budgets_pour(annee: Annee, siret: Siret, etape: EtapeBudgetaire) {
        this.donneesBudgetairesStore.dispatch(new DonnneesBudgetairesInitAction(annee, siret, etape))
        this.informationsPdcStore.dispatch(new InformationsPdcInitAction(annee, siret));
    }

    load_budgets_disponibles_pour(siren: Siren) {
        this.donneesBudgetairesDisponiblesStore.dispatch(new BudgetDisponiblesInitAction(siren))
    }

    select_donnees_et_etabname(annee: Annee, siret: Siret, etape: EtapeBudgetaire) {
        let donnees$ = this.donneesBudgetairesStore.select(selectDonneesPour(annee, siret, etape));
        let pdc$ = this.informationsPdcStore.select(selectInformationsPdcPour(annee, siret));
        let etabName$ = this.donneesBudgetairesDisponiblesStore.select(
            BudgetViewModelSelectors.DonneesDisponibles.etablissementPrettyname(siret)
        );
        return combineLatest([donnees$, pdc$, etabName$])
    }

    select_donnees(annee: Annee, siret: Siret, etape: EtapeBudgetaire) {
        let donnees$ = this.donneesBudgetairesStore.select(selectDonneesPour(annee, siret, etape));
        let pdc$ = this.informationsPdcStore.select(selectInformationsPdcPour(annee, siret));
        return combineLatest([donnees$, pdc$])
    }

    select_etabname(siret) {
        let etabName$ = this.donneesBudgetairesDisponiblesStore.select(
            BudgetViewModelSelectors.DonneesDisponibles.etablissementPrettyname(siret)
        );
        return etabName$
    }

    select_donnees_disponibles_callstate(siren: Siren) {
        return this.donneesBudgetairesDisponiblesStore.select(selectDonneesBudgetairesDisponiblesCallStatePour(siren))
    }

    select_donnees_budgetaires_callstate(annee: Annee, siret: Siret, etape: EtapeBudgetaire) {
        return this.donneesBudgetairesStore.select(selectDonneesBudgtetairesCallStatePour(annee, siret, etape))
    }

    select_donnees_disponibles_pour(siren: Siren) {
        return this.donneesBudgetairesDisponiblesStore
            .select(selectDonneesBudgetairesDisponiblesPour(siren))
    }
}