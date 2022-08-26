import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NavigationComponent } from "../components/navigation/navigation.component";
import { AuthGuard } from "../services/auth-guard.service";
import { BudgetConsultationComponent } from "./components/budget-consultation/budget-consultation.component";
import { BudgetParametrageComponent } from "./components/budget-parametrage/budget-parametrage.component";

const routes: Routes = [
    {
        path: '',
        component: NavigationComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: BudgetParametrageComponent,
            }
        ]
    },
    {
        path: 'consultation/:siren/:annee/:etape',
        component: BudgetConsultationComponent,
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BudgetRoutingModule { }