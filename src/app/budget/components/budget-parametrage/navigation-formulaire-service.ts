import { Observable, ReplaySubject, Subject } from "rxjs";
import { Annee, Siren, Siret } from "../../models/common-types";
import { DonneesBudgetairesDisponibles, donnees_budgetaires_disponibles_etapes, donnees_budgetaires_disponibles_sirets } from "../../models/donnees-budgetaires-disponibles";
import { BudgetParametrageNavFormulaireModel } from "./budget-parametrage-nav/budget-parametrage-nav-formulaire-model";
import { distinctUntilChanged, first, map, mergeMap, takeUntil, tap } from "rxjs/operators";
import { EtapeBudgetaire } from "../../models/etape-budgetaire";
import { etablissements_vers_comboViewModel, etape_vers_comboViewModel } from "../../models/view-models.functions";
import { BudgetsStoresService } from "../../services/budgets-store.service";
import { SettingsService } from "src/environments/settings.service";

export interface NavigationValues {
    annee?: Annee
    siret?: Siret
    etape?: EtapeBudgetaire
}

function _eq(previous: NavigationValues, current: NavigationValues) {
    return previous.annee === current.annee
        && previous.siret === current.siret
        && previous.etape === current.etape
}

export class NavigationFormulaireService {

    private _initialize$ = new ReplaySubject<void>(1)
    private _stop$ = new Subject<void>()

    private _siren?: Siren
    set siren(siren: Siren) {
        this._siren = siren
        this.check_initialize_and_emit()
    }
    private _formModel?: BudgetParametrageNavFormulaireModel
    set formModel(model: BudgetParametrageNavFormulaireModel) {
        this._formModel = model
        this.check_initialize_and_emit()
    }

    private _donnees_disponibles?: DonneesBudgetairesDisponibles
    get donnees_disponibles() {
        return this._donnees_disponibles
    }
    set donnees_disponibles(disponibles: DonneesBudgetairesDisponibles) {
        this._donnees_disponibles = disponibles
        this.check_initialize_and_emit()
    }

    private _setupDone$ = new Subject<void>()

    constructor(
        private siren$: Observable<Siren>,
        private budgetsStoreServices: BudgetsStoresService,
        private settingsService: SettingsService,
    ) {

        let _siren$ = this.siren$.pipe(distinctUntilChanged())

        _siren$.pipe(
            tap(siren => this.siren = siren),
            mergeMap(siren => this.budgetsStoreServices.select_donnees_disponibles(siren)),
            takeUntil(this._stop$),
        ).subscribe(disponibles => {
            this.donnees_disponibles = disponibles
        })
    }


    /** Navigation values passées par les règles de validation */
    get validatedNavigationValues$(): Observable<NavigationValues> {
        return this._setupDone$.pipe(
            map(() => {
                return {
                    annee: this._formModel.annee,
                    siret: this._formModel.etablissement,
                    etape: this._formModel.etape,
                }
            }),
            distinctUntilChanged(_eq),
        )
    }

    get initialized$() {
        return this._initialize$.pipe(first())
    }

    private check_initialize_and_emit() {
        if (this.is_initialized)
            this._initialize$.next()
    }

    setup_form_annee(annee: Annee) {
        this.setup_form({ annee })
    }
    setup_form_etab(siret: Siret) {
        this.setup_form({ siret })
    }
    setup_form_etape(etape: EtapeBudgetaire) {
        this.setup_form({ etape })
    }

    setup_form(args: NavigationValues) {
        if (!this.is_initialized) return

        let annee = (args.annee !== undefined) ? args.annee : this._formModel.annee
        let siret = (args.siret !== undefined) ? args.siret : this._formModel.etablissement
        let etape = (args.etape !== undefined) ? args.etape : this._formModel.etape

        let annees_dispo_fn = () => this.annees_dispo_vm()
        let etabs_dispo_fn = (annee) => this.etabs_dispo_combo_vm(annee)
        let etapes_dispo_fn = (annee, siret) => this.etapes_disponibles_combo_vm(annee, siret)

        this._formModel.setup(
            annee, annees_dispo_fn,
            siret, etabs_dispo_fn,
            etape, etapes_dispo_fn
        )

        this._setupDone$.next()
    }


    private get is_initialized() {
        return Boolean(this._siren) && Boolean(this._formModel) && Boolean(this.donnees_disponibles)
    }


    private etapes_disponibles_combo_vm(annee?: Annee, siret?: Siret) {
        let disponibles = this.donnees_disponibles

        let etapes_a_afficher = this.settingsService.budgets_etapes_a_afficher as EtapeBudgetaire[]

        let all_etapes = Object.values(EtapeBudgetaire)
            .filter(e => etapes_a_afficher.includes(e))

        let etapes_disponibles = donnees_budgetaires_disponibles_etapes(disponibles, annee, siret)

        let etapesvm = all_etapes.map(e => {
            let disabled = !etapes_disponibles.includes(e)
            return etape_vers_comboViewModel(e, disabled)
        });

        return etapesvm;
    }

    private etabs_dispo_combo_vm(annee?: Annee) {
        let disponibles = this.donnees_disponibles

        let tous_sirets = donnees_budgetaires_disponibles_sirets(disponibles)
        let sirets_actifs = donnees_budgetaires_disponibles_sirets(disponibles, annee)

        return etablissements_vers_comboViewModel(disponibles, tous_sirets, sirets_actifs)
    }

    private annees_dispo_vm() {
        if (!this.donnees_disponibles || !this.donnees_disponibles.ressources_disponibles) return []

        let ressources_disponibles = this.donnees_disponibles.ressources_disponibles
        let annees = Object.keys(ressources_disponibles)
        return [...new Set(annees)].sort().reverse()
    }

    destroy() {
        this._stop$.next()
        this._stop$.complete()
    }

    debug(msg) {
        console.debug(`[NavigationFormulaireService] ${msg}`);
    }

}