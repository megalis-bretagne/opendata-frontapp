import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NavigationComponent } from "../components/navigation/navigation.component";
import { AuthGuard } from "../services/auth-guard.service";
import { BudgetConsultationComponent } from "./components/budget-consultation/budget-consultation.component";
import { BudgetParametrageComponent } from "./components/budget-parametrage/budget-parametrage.component";
import { ROUTE_CONSULTATION_PATH } from "./services/routing.service";

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
        path: `${ROUTE_CONSULTATION_PATH}`,
        component: BudgetConsultationComponent,
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BudgetRoutingModule { }