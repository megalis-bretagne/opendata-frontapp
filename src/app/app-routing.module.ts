import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard.service';
import { ParametrageOrganisationComponent } from './components/parametrage-organisation/parametrage-organisation.component';
import { ValiderTableComponent } from './components/valider-table/valider-table.component';
import { MarqueBlancheComponent } from './components/marque-blanche/marque-blanche.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ROUTE_PREFIX_MODULE as BUDGETS_ROUTE_PREFIX_MODULE } from './budget/services/routing.service';

const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ValiderTableComponent,
      },
      {
        path: 'parametrage',
        component: ParametrageOrganisationComponent,
      },
      {
        path: 'marqueblanche',
        component: MarqueBlancheComponent,
      },
    ]
  },
  {
    path: BUDGETS_ROUTE_PREFIX_MODULE,
    loadChildren: () => import('./budget/budget.module').then(m => m.BudgetModule)
  },
  {
    path: '**',
    redirectTo: '/'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule { }
