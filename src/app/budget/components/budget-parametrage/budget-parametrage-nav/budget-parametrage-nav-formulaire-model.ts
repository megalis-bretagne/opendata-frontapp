import { FormControl, FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
import { Annee, Siret } from "src/app/budget/models/common-types";
import { EtapeBudgetaire } from "src/app/budget/models/etape-budgetaire";
import { EtablissementComboItemViewModel, EtapeComboItemViewModel } from "src/app/budget/models/view-models";

export const ANNEE_KEY = 'annee'
export const ETAPE_KEY = 'etape'
export const ETAB_KEY = 'etab'

export class BudgetParametrageNavFormulaireModel {
    annees_disponibles: Annee[] = []
    etapes_options: EtapeComboItemViewModel[]
    etablissements_options: EtablissementComboItemViewModel[]

    private _fg: FormGroup
    private _etablissement$: Observable<Siret>;
    private _etape$: Observable<EtapeBudgetaire>;
    private _annee$: Observable<Annee>;

    setup_annees(annee: Annee, disponibles: Annee[]) {
        // this._debug(`Setup annee: ${annee}, ${disponibles.length} disponibles`)
        let _annee = this.normalize_annee(annee, disponibles)
        this.annees_disponibles = disponibles
        this.annee = _annee
    }

    setup_etapes(etape: EtapeBudgetaire, disponibles: EtapeComboItemViewModel[]) {
        // let enabled = disponibles.filter(e => !e.disabled)
        // this._debug(`Setup etape: ${etape}, ${disponibles.length} disponibles, ${enabled.length} actives`)
        let _etape = this.normalize_etape(etape, disponibles)
        this.etapes_options = disponibles
        this.etape = _etape
    }

    setup_etablissement(etab: Siret, disponibles: EtablissementComboItemViewModel[]) {
        // this._debug(`Setup etablissements: ${etab}, ${disponibles.length} disponibles`)
        let _etab = this.normalize_etablissement(etab, disponibles);
        this.etablissements_options = disponibles
        this.etablissement = _etab
    }

    // private setup(
    //     annee: Annee, annees_disp: Annee[],
    //     etape: EtapeBudgetaire, etapes_disp: EtapeComboItemViewModel[],
    //     etab: Siret, etab_disp: EtablissementComboItemViewModel[],
    // ) {

    //     let _annee = this.normalize_annee(annee, annees_disp)
    //     this.annees_disponibles = annees_disp
    //     this.annee = _annee

    //     let _etape = this.normalize_etape(etape, etapes_disp)
    //     this.etapes_options = etapes_disp
    //     this.etape = _etape

    //     let _etab = this.normalize_etablissement(etab, etab_disp);
    //     this.etablissements_options = etab_disp
    //     this.etablissement = _etab
    // }

    constructor() {

        let fg = new FormGroup({})
        fg.addControl(ANNEE_KEY, new FormControl())
        fg.addControl(ETAPE_KEY, new FormControl())
        fg.addControl(ETAB_KEY, new FormControl())
        this._fg = fg

        this._etape$ = this._fg.get(ETAPE_KEY).valueChanges.pipe(distinctUntilChanged())
        this._annee$ = this._fg.get(ANNEE_KEY).valueChanges.pipe(distinctUntilChanged())
        this._etablissement$ = this._fg.get(ETAB_KEY).valueChanges.pipe(distinctUntilChanged())
    }

    get fg() { return this._fg }

    // #region annee
    get annee(): Annee {
        return this._fg.get(ANNEE_KEY).value
    }
    get annee$(): Observable<Annee> {
        return this._annee$;
    }
    set annee(annee: Annee) {
        this._fg.get(ANNEE_KEY).setValue(annee)
    }

    get annee_selected_index() {
        return this.annees_disponibles.indexOf(this.annee)
    }
    set annee_selected_index(index: number) {
        let annee = this.annees_disponibles[index]
        this.annee = annee
    }

    private normalize_annee(annee: Annee, disponibles: Annee[]) {

        let defaultAnnee = (disponibles.length > 0) ? disponibles[0] : undefined
        if (!(disponibles.includes(annee)))
            return defaultAnnee
        return annee
    }
    // #endregion


    // #region etapes
    get etape$() {
        return this._etape$
    }
    get etape() {
        return this._fg.get(ETAPE_KEY).value
    }
    set etape(etape: EtapeBudgetaire) {
        this._fg.get(ETAPE_KEY).setValue(etape)
    }


    private normalize_etape(etape: EtapeBudgetaire, etapesDisponibles: EtapeComboItemViewModel[]): EtapeBudgetaire {

        let enabled_etapes = etapesDisponibles.filter(dispo => !dispo.disabled).map(vm => vm.value)
        let default_etape_selection = (enabled_etapes.length > 0) ? enabled_etapes[0] : null

        let selected = etape
        if (!etape || !enabled_etapes.includes(selected))
            selected = default_etape_selection

        return selected
    }
    // #endregion

    // #region etablissement
    get etablissement() {
        return this._fg.get(ETAB_KEY).value
    }
    get etablissement$() {
        return this._etablissement$;
    }
    set etablissement(etab: Siret) {
        this._fg.get(ETAB_KEY).setValue(etab)
    }

    private normalize_etablissement(siret: Siret, etablissements: EtablissementComboItemViewModel[]): Siret {

        let enabled_etabs = etablissements.filter(e => !e.disabled).map(vm => vm.value)
        let default_etabs = (enabled_etabs.length > 0) ? enabled_etabs[0] : null

        let selected = siret

        if (!selected || !enabled_etabs.includes(selected))
            selected = default_etabs


        return selected
    }
    // #endregion

    private _debug(_: string) {
        // console.debug(`[FORMULAIRE] ${msg}`)
    }
}