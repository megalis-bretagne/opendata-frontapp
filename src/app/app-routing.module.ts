import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard.service';
import { ParametrageOrganisationComponent } from './components/parametrage-organisation/parametrage-organisation.component';
import { ValiderTableComponent } from './components/valider-table/valider-table.component';
import { MarqueBlancheComponent } from './components/marque-blanche/marque-blanche.component';
import { ParametragePastellComponent } from "./components/parametrage-pastell/parametrage-pastell.component";
import { NavigationComponent } from './components/navigation/navigation.component';

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
      {
        path: 'pastell',
        component: ParametragePastellComponent,
      },
    ]
  },
  {
    path: 'budget',
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
