import { Inject, Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, startWith, switchMap } from "rxjs/operators";
import { DonneesBudgetaires } from "../../models/donnees-budgetaires";
import { BudgetService, BUDGET_SERVICE_TOKEN } from "../../services/budget.service";
import { BudgetDisponiblesNoopAction, BudgetDisponiblesInitAction, BudgetDisponiblesLoadFailureAction, BudgetDisponiblesLoadingAction, BudgetDisponiblesLoadSuccessAction, DonneesBudgetairesDisponiblesActionType } from "../actions/donnees-budgetaires-disponibles.actions";
import { DonneesBudgetairesActionType, DonnneesBudgetairesNoopAction, DonnneesBudgetairesLoadFailureAction, DonnneesBudgetairesLoadingAction, DonnneesBudgetairesLoadSuccessAction, DonnneesBudgetairesInitAction } from "../actions/donnees-budgetaires.actions";
import { InformationsPdcActionType, InformationsPdcNoopAction, InformationsPdcLoadFailureAction, InformationsPdcLoadingAction, InformationsPdcLoadSuccessAction, InformationsPdcInitAction } from "../actions/informations-pdc.actions";
import { selectDonneesBudgetairesDisponiblesCallStatePour } from "../selectors/donnees-budgetaires-disponibles.selectors";
import { selectDonneesBudgtetairesCallStatePour } from "../selectors/donnees-budgetaires.selectors";
import { selectInformationsPdcCallStatePour } from "../selectors/informations-pdc.selectors";
import { LoadingState } from "../states/call-states";
import { DonneesBudgetairesDisponiblesState } from "../states/donnees-budgetaires-disponibles.state";
import { DonneesBudgetairesState } from "../states/donnees-budgetaires.state";
import { InformationsPdcState } from "../states/informations-pdc.state";

@Injectable()
export class BudgetEffects {
    constructor(
        @Inject(BUDGET_SERVICE_TOKEN)
        private budgetService: BudgetService,
        private actions$: Actions,
        private donneesBudgetairesStore: Store<DonneesBudgetairesState>,
        private informationsPdcStore: Store<InformationsPdcState>,
        private donneesBudgetairesDisponiblesStore: Store<DonneesBudgetairesDisponiblesState>,
    ) { }

    public initBudgets$ = createEffect(
        () => this.actions$
            .pipe(
                ofType<DonnneesBudgetairesInitAction>(DonneesBudgetairesActionType.Init),

                concatLatestFrom(action => this.donneesBudgetairesStore.select(selectDonneesBudgtetairesCallStatePour(action.annee, action.siret, action.etape))),

                switchMap(([action, callState]) => {
                    if (callState === LoadingState.LOADED || callState === LoadingState.LOADING)
                        return of(new DonnneesBudgetairesNoopAction(action.annee, action.siret, action.etape))

                    return of(new DonnneesBudgetairesLoadingAction(action.annee, action.siret, action.etape))
                }
                )
            ),
        { dispatch: true },
    );

    public loadBudgets$ = createEffect(
        () => this.actions$
            .pipe(
                ofType<DonnneesBudgetairesLoadingAction>(DonneesBudgetairesActionType.Loading),

                switchMap(action => {

                    let annee = action.annee
                    let siret = action.siret
                    let etape = action.etape

                    return this.budgetService.loadBudgets(annee, siret, etape)
                        .pipe(
                            map((donnees) =>
                                new DonnneesBudgetairesLoadSuccessAction(
                                    annee, siret, etape,
                                    donnees as DonneesBudgetaires
                                )
                            ),
                            catchError(err => {
                                console.error(err);
                                return of(new DonnneesBudgetairesLoadFailureAction(annee, siret, etape, err))
                            }),
                        );
                }
                )
            ),
        { dispatch: true },
    );

    public initPdc$ = createEffect(
        () => this.actions$
            .pipe(
                ofType<InformationsPdcInitAction>(InformationsPdcActionType.Init),

                concatLatestFrom(action => this.informationsPdcStore.select(selectInformationsPdcCallStatePour(action.annee, action.siret))),

                switchMap(([action, callState]) => {

                    if (callState === LoadingState.LOADED || callState === LoadingState.LOADING)
                        return of(new InformationsPdcNoopAction(action.annee, action.siret, 'Chargement en cours ou déjà réalisé'))

                    return of(new InformationsPdcLoadingAction(action.annee, action.siret))
                })
            ),
        { dispatch: true }
    )

    public loadPdc$ = createEffect(
        () => this.actions$
            .pipe(
                ofType<InformationsPdcLoadingAction>(InformationsPdcActionType.Loading),
                switchMap(action => {
                    return this.budgetService.loadInformationPdc(action.annee, action.siret)
                        .pipe(
                            map(pdc => new InformationsPdcLoadSuccessAction(action.annee, action.siret, pdc)),
                            catchError(err => of(new InformationsPdcLoadFailureAction(action.annee, action.siret, err))),
                        )
                })
            ),
        { dispatch: true }
    )

    public initDonneesBudgetairesDisponibles$ = createEffect(
        () => this.actions$
            .pipe(
                ofType<BudgetDisponiblesInitAction>(DonneesBudgetairesDisponiblesActionType.Init),
                map(action => action.siren),

                concatLatestFrom(siren => this.donneesBudgetairesDisponiblesStore.select(selectDonneesBudgetairesDisponiblesCallStatePour(siren))),

                switchMap(([siren, callState]) => {

                    if (callState === LoadingState.LOADED || callState === LoadingState.LOADING)
                        return of(new BudgetDisponiblesNoopAction(siren))
                    
                    return of(new BudgetDisponiblesLoadingAction(siren))
                }),
            ),
        { dispatch: true },
    )

    public loadDonneesBudgetairesDisponibles$ = createEffect(
        () => this.actions$
        .pipe(
            ofType<BudgetDisponiblesLoadingAction>(DonneesBudgetairesDisponiblesActionType.Loading),
            map(action => action.siren),
            switchMap(siren => {
                return this.budgetService.donneesBudgetairesDisponibles(siren)
                    .pipe(
                        map(disponibles => new BudgetDisponiblesLoadSuccessAction(siren, disponibles)),
                        catchError(err => of(new BudgetDisponiblesLoadFailureAction(siren, err))),
                    )
            } )
        ),
        { dispatch: true }
    )
}