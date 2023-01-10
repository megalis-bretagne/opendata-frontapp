import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { combineLatest, Observable, startWith } from "rxjs";
import { filter, map, mergeMap } from 'rxjs/operators';
import { Annee, extract_siren, Siren, Siret } from "../models/common-types";
import { DefaultVisualisationParametrageLocalisation } from "../models/defaultvisualisation-parametrage";
import { EtapeBudgetaire } from "../models/etape-budgetaire";
import { VisualisationTitres } from "../models/view-models";
import { etablissement_pretty_name } from "../models/view-models.functions";
import { VisualisationGraphId } from "../models/visualisation.model";
import { DefaultVisualisationParametrageEditAction, DefaultVisualisationParametrageInitAction } from "../store/actions/default-visualisation-parametrages.action";
import { BudgetDisponiblesInitAction } from "../store/actions/donnees-budgetaires-disponibles.actions";
import { DonnneesBudgetairesInitAction } from "../store/actions/donnees-budgetaires.actions";
import { selectDefaultVisualisationParametrageCallStatePour, selectDefaultVisualisationParametragesPour } from "../store/selectors/default-visualisation-parametrages.selector";
import { selectDonneesBudgetairesDisponiblesCallStatePour, selectDonneesBudgetairesDisponiblesPour } from "../store/selectors/donnees-budgetaires-disponibles.selectors";
import { selectDonneesBudgtetairesCallStatePour, selectDonneesPour } from "../store/selectors/donnees-budgetaires.selectors";
import { selectInformationsPdcCallStatePour, selectInformationsPdcPour } from "../store/selectors/informations-pdc.selectors";
import { isInError, LoadingState } from "../store/states/call-states";
import { DefaultVisualisationParametrageState } from "../store/states/default-visualisation-parametrages.state";
import { DonneesBudgetairesDisponiblesState } from "../store/states/donnees-budgetaires-disponibles.state";
import { DonneesBudgetairesState } from "../store/states/donnees-budgetaires.state";
import { InformationsPdcState } from "../store/states/informations-pdc.state";

@Injectable({
    providedIn: 'root'
})
export class BudgetsStoresService {
    constructor(
        private defaultVisualisationParametrageStore: Store<DefaultVisualisationParametrageState>,
        private donneesBudgetairesDisponiblesStore: Store<DonneesBudgetairesDisponiblesState>,
        private donneesBudgetairesStore: Store<DonneesBudgetairesState>,
        private informationsPdcStore: Store<InformationsPdcState>,
    ) { }

    load_budgets_pour(annee: Annee, siret: Siret, etape: EtapeBudgetaire) {
        this.donneesBudgetairesStore.dispatch(new DonnneesBudgetairesInitAction(annee, siret, etape))
        this.defaultVisualisationParametrageStore.dispatch(new DefaultVisualisationParametrageInitAction(annee, siret, etape))
    }

    load_budgets_disponibles_pour(siren: Siren) {
        this.donneesBudgetairesDisponiblesStore.dispatch(new BudgetDisponiblesInitAction(siren))
    }

    edit_defaultvisualisation_titres_pour(annee: Annee, siret: Siret, etape: EtapeBudgetaire, grapheId: VisualisationGraphId, titre?: string, sous_titre?: string) {
        this.defaultVisualisationParametrageStore.dispatch(new DefaultVisualisationParametrageEditAction(annee, siret, etape, grapheId, titre, sous_titre))
    }

    select_donnees_disponibles(siren: Siren) {
        return this.donneesBudgetairesDisponiblesStore
            .select(selectDonneesBudgetairesDisponiblesPour(siren))
    }

    select_donnees_budgetaires(annee: Annee, siret: Siret, etape: EtapeBudgetaire) {
        let donnees$ = this.donneesBudgetairesStore.select(selectDonneesPour(annee, siret, etape));
        return donnees$
    }

    select_pdc(annee: Annee, nomenclature: string) {
        return this.informationsPdcStore.select(selectInformationsPdcPour(annee, nomenclature))
    }

    /** Selectionne le plan de compte correspondant aux données budgetaires. */
    select_pdc_of_donnees_budgetaires(annee: Annee, siret: Siret, etape: EtapeBudgetaire) {
        let donnees$ = this.select_donnees_budgetaires(annee, siret, etape)
        return donnees$.pipe(
            filter(donnees => Boolean(donnees)),
            mergeMap(donnees => {
                let annee = donnees.pdc_info.annee
                let nomenclature = donnees.pdc_info.nomenclature

                return this.select_pdc(annee, nomenclature)
            })
        )
    }

    select_default_visualisation_parametrages(localisation: DefaultVisualisationParametrageLocalisation) {
        return this.defaultVisualisationParametrageStore.select(selectDefaultVisualisationParametragesPour(localisation))
    }

    select_donnees_disponibles_callstate(siren: Siren) {
        return this.donneesBudgetairesDisponiblesStore.select(selectDonneesBudgetairesDisponiblesCallStatePour(siren))
    }

    select_donnees_budgetaires_callstate(annee: Annee, siret: Siret, etape: EtapeBudgetaire) {
        return this.donneesBudgetairesStore.select(selectDonneesBudgtetairesCallStatePour(annee, siret, etape))
    }

    select_default_visualisation_parametrage_callstate(localisation: DefaultVisualisationParametrageLocalisation) {
        return this.defaultVisualisationParametrageStore.select(
            selectDefaultVisualisationParametrageCallStatePour(localisation)
        )
    }

    select_pdc_callstate(annee: Annee, nomenclature: string) {
        return this.informationsPdcStore.select(selectInformationsPdcCallStatePour(annee, nomenclature))
    }


    private _vms = new ViewModelStoreService(this)
    get viewModels() {
        return this._vms
    }
}

class ViewModelStoreService {

    constructor(private budgetStoreService: BudgetsStoresService) { }

    private _select_pdc_callstate(annee: Annee, siret: Siret, etape: EtapeBudgetaire) {
        return this.budgetStoreService.select_donnees_budgetaires(annee, siret, etape)
            .pipe(
                filter(donnees => Boolean(donnees)),
                mergeMap(donnees => {
                    let annee = donnees.pdc_info.annee
                    let nomenclature = donnees.pdc_info.nomenclature

                    return this.budgetStoreService.select_pdc_callstate(annee, nomenclature)
                }),
                startWith(LoadingState.LOADING),
            )
    }

    private zipped_callstates(annee: Annee, siret: Siret, etape: EtapeBudgetaire) {
        let donnees$ = this.budgetStoreService.select_donnees_budgetaires_callstate(annee, siret, etape)
            .pipe(startWith(LoadingState.LOADING))
        let pdc$ = this._select_pdc_callstate(annee, siret, etape)

        return combineLatest([donnees$, pdc$])
    }

    select_is_budget_loading(annee: Annee, siret: Siret, etape: EtapeBudgetaire) {

        let zipped$ = this.zipped_callstates(annee, siret, etape)

        let isLoading$ = zipped$.pipe(
            map(([cs1, cs2]) => {
                let is_donnees_loading = (cs1 === LoadingState.LOADING)
                let is_pdc_loading = (cs2 === LoadingState.LOADING)

                return is_donnees_loading || is_pdc_loading
            })
        )

        return isLoading$
    }

    select_is_budget_in_error(annee: Annee, siret: Siret, etape: EtapeBudgetaire) {

        let zipped$ = this.zipped_callstates(annee, siret, etape)

        let isInError$ = zipped$.pipe(
            map(([cs1, cs2]) => {

                let is_donnees_in_error = isInError(cs1)
                let is_pdc_in_error = isInError(cs2)

                return is_donnees_in_error || is_pdc_in_error
            })
        )

        return isInError$
    }

    select_visualisation_titres_is_loading(localisation: DefaultVisualisationParametrageLocalisation) {

        return this.budgetStoreService.select_default_visualisation_parametrage_callstate(localisation)
            .pipe(
                map((cs) => !cs || cs == LoadingState.LOADING)
            )
    }

    select_visualisation_titres_is_in_error(localisation: DefaultVisualisationParametrageLocalisation) {

        return this.budgetStoreService.select_default_visualisation_parametrage_callstate(localisation)
            .pipe(
                map((cs) => isInError(cs))
            )
    }

    select_visualisation_titres(localisation: DefaultVisualisationParametrageLocalisation): Observable<VisualisationTitres> {
        return this.budgetStoreService.select_default_visualisation_parametrages(localisation)
            .pipe(
                filter(parametrage => Boolean(parametrage)),
                map(parametrage => {
                    return {
                        titre: parametrage.titre,
                        sous_titre: parametrage.sous_titre
                    }
                })
            )
    }

    select_etablissement_pretty_name(siret: Siret) {
        let siren = extract_siren(siret)
        return this.budgetStoreService.select_donnees_disponibles(siren)
            .pipe(
                map(disponibles => {
                    if (!disponibles || !disponibles.infos_etablissements || !disponibles.infos_etablissements[siret])
                        return ''
                    let etablissement = disponibles.infos_etablissements[siret]
                    return etablissement_pretty_name(etablissement)
                }
                )
            )
    }

    select_budget(annee: Annee, siret: Siret, etape: EtapeBudgetaire) {
        let donnees$ = this.budgetStoreService.select_donnees_budgetaires(annee, siret, etape);
        let pdc$ = this.budgetStoreService.select_pdc_of_donnees_budgetaires(annee, siret, etape);
        return combineLatest([donnees$, pdc$]);
    }

    select_budget_et_etabname(annee: Annee, siret: Siret, etape: EtapeBudgetaire) {
        let donnees$ = this.budgetStoreService.select_donnees_budgetaires(annee, siret, etape);
        let pdc$ = this.budgetStoreService.select_pdc_of_donnees_budgetaires(annee, siret, etape);
        let etabName$ = this.select_etablissement_pretty_name(siret);
        return combineLatest([donnees$, pdc$, etabName$]);
    }
}