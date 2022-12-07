import { Injectable } from "@angular/core";
import { combineLatest, combineLatestWith, map, Subject, Subscription } from "rxjs";
import { DefaultVisualisationParametrageLocalisation } from "../../models/defaultvisualisation-parametrage";
import { DonneesBudgetaires } from "../../models/donnees-budgetaires";
import { Pdc } from "../../models/plan-de-comptes";
import { Visualisation } from "../../models/visualisation.model";
import { BudgetsStoresService } from "../../services/budgets-store.service";
import { RoutingService } from "../../services/routing.service";

export abstract class VisualisationComponentService {

    /** Observable qui indique lorsque les données de visualisation ont été mises à jour */
    visualisationUpdate$ = new Subject<void>()

    abstract get is_loading$()
    abstract get is_in_error$()
    abstract get is_successfully_loaded$()

    abstract get visualisation(): Visualisation
    abstract set visualisation(visualisation: Visualisation)
    abstract get url_consultation(): string

    default_titre: string
    default_description: string

    titre?: string
    description?: string
    graphe_id: string

    donnees_budgetaires?: DonneesBudgetaires
    informations_pdc?: Pdc.InformationsPdc

    abstract init()
    abstract destroy()
}

@Injectable()
export class BudgetCardComponentService extends VisualisationComponentService {

    private _param_sub: Subscription;

    get is_loading$() {
        let b_is_loading$ = this.storesServices.viewModels.select_is_budget_loading(
            this.visualisation.annee,
            this.visualisation.siret,
            this.visualisation.etape
        )
        let p_is_loading$ = this.storesServices.viewModels.select_visualisation_titres_is_loading(this.defaultVisualisationParametrageLocalisation)

        let combined$ = combineLatest([b_is_loading$, p_is_loading$])
            .pipe(map(([b1, b2]) => b1 || b2))

        return combined$
    }

    get is_in_error$() {

        let b_in_error$ = this.storesServices.viewModels.select_is_budget_in_error(
            this.visualisation.annee,
            this.visualisation.siret,
            this.visualisation.etape
        )
        let p_in_error$ = this.storesServices.viewModels.select_visualisation_titres_is_in_error(this.defaultVisualisationParametrageLocalisation)

        let combined$ = combineLatest([b_in_error$, p_in_error$])
            .pipe(map(([b1, b2]) => b1 || b2))
        return combined$
    }

    get is_successfully_loaded$() {
        return this.is_loading$
            .pipe(
                combineLatestWith(this.is_in_error$),
                map(([loading, inError]) => !loading && !inError)
            )
    }

    constructor(
        private routingService: RoutingService,
        private storesServices: BudgetsStoresService,
    ) {
        super();
    }

    private _visualisation: Visualisation;

    public get visualisation(): Visualisation {
        return this._visualisation;
    }

    public set visualisation(visualisation: Visualisation) {
        this._visualisation = visualisation;

        if (!this._visualisation)
            return

        this.titre = this._visualisation.titre
        this.default_titre = this._visualisation.titre
        this.description = this.visualisation.description
        this.default_description = this._visualisation.description
        this.graphe_id = this.visualisation.graphe_id

        if (this._visualisation.donnees_budgetaires)
            this.donnees_budgetaires = this._visualisation.donnees_budgetaires

        if (this._visualisation.informations_pdc)
            this.informations_pdc = this._visualisation.informations_pdc

        let vis_localisation: DefaultVisualisationParametrageLocalisation = { 
            annee: visualisation.annee, 
            siret: visualisation.siret, 
            etape: visualisation.etape, 
            graphe_id: visualisation.graphe_id 
        }
        if (this._param_sub)
            this._param_sub.unsubscribe()
        this._param_sub = this.storesServices.viewModels.select_visualisation_titres(vis_localisation)
            .subscribe(parametrage => {
                if (!parametrage)
                    return
                this.titre = parametrage.titre
                this.description = parametrage.sous_titre
            })

        this.visualisationUpdate$.next()
    }

    get url_consultation(): string {
        return this.routingService.external_url_consultation_grapheId(
            this.visualisation.annee,
            this.visualisation.siret,
            this.visualisation.etape,
            this.visualisation.graphe_id
        )
    }

    init() { }
    destroy() { }

    get defaultVisualisationParametrageLocalisation(): DefaultVisualisationParametrageLocalisation {
        return {
            annee: this.visualisation.annee,
            siret: this.visualisation.siret,
            etape: this.visualisation.etape,
            graphe_id: this.visualisation.graphe_id
        }
    }
}