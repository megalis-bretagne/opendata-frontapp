import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './services/auth-guard.service';
import {ParametrageOrganisationComponent} from './components/parametrage-organisation/parametrage-organisation.component';
import {ValiderTableComponent} from './components/valider-table/valider-table.component';
import {MarqueBlancheComponent} from './components/marque-blanche/marque-blanche.component';
import {ParametragePastellComponent} from "./components/parametrage-pastell/parametrage-pastell.component";

const routes: Routes = [
  {
    path: '',
    component: ValiderTableComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'parametrage',
    component: ParametrageOrganisationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'marqueblanche',
    component: MarqueBlancheComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pastell',
    component: ParametragePastellComponent,
    canActivate: [AuthGuard]
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
