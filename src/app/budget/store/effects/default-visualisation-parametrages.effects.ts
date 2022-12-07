import { Inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { BudgetService, BUDGET_SERVICE_TOKEN } from "../../services/budget.service";
import { DefaultVisualisationParametrageActionType, DefaultVisualisationParametrageEditAction, DefaultVisualisationParametrageEditFailureAction, DefaultVisualisationParametrageEditSuccessAction, DefaultVisualisationParametrageInitAction, DefaultVisualisationParametrageLoadFailureAction, DefaultVisualisationParametrageLoadingAction, DefaultVisualisationParametrageLoadSuccessAction } from "../actions/default-visualisation-parametrages.action";

@Injectable()
export class DefaultVisualisationParametragesEffects {
    constructor(
        @Inject(BUDGET_SERVICE_TOKEN)
        private budgetService: BudgetService,
        private actions$: Actions,
    ) { }

    public initDefaultVisualisationParametrages$ = createEffect(
        () => this.actions$
            .pipe(
                ofType<DefaultVisualisationParametrageInitAction>(DefaultVisualisationParametrageActionType.Init),

                switchMap((action) => {
                    let annee = action.annee
                    let siret = action.siret
                    let etape = action.etape
                    return of(new DefaultVisualisationParametrageLoadingAction(annee, siret, etape))
                }),
            ),
        { dispatch: true },
    )

    public loadDefaultVisualisationParametrages$ = createEffect(
        () => this.actions$
            .pipe(
                ofType<DefaultVisualisationParametrageLoadingAction>(DefaultVisualisationParametrageActionType.Loading),
                switchMap(action => {

                    let annee = action.annee
                    let siret = action.siret
                    let etape = action.etape

                    return this.budgetService.loadTitresPour(annee, siret, etape)
                        .pipe(
                            map(parametrages => new DefaultVisualisationParametrageLoadSuccessAction(annee, siret, etape, parametrages)),
                            catchError(err => of(new DefaultVisualisationParametrageLoadFailureAction(annee, siret, etape, err))),
                        )
                })
            ),
        { dispatch: true }
    )

    public editDefaultVisualisationParametrages$ = createEffect(
        () => this.actions$
            .pipe(
                ofType<DefaultVisualisationParametrageEditAction>(DefaultVisualisationParametrageActionType.Edit),
                switchMap(action => {

                    let annee = action.annee
                    let siret = action.siret
                    let etape = action.etape
                    let grapheId = action.graphe_id
                    let titre = action.titre
                    let description = action.sous_titre

                    return this.budgetService
                        .editTitresPour(
                            annee, siret, etape, grapheId,
                            titre, description,
                        )
                        .pipe(
                            map((parametrage) => new DefaultVisualisationParametrageEditSuccessAction(
                                annee, siret, etape, grapheId,
                                parametrage
                            )),
                            catchError(_ => of(new DefaultVisualisationParametrageEditFailureAction(annee, siret, etape, grapheId, titre, description)))
                        )
                })
            ),
        { dispatch: true }
    )
}