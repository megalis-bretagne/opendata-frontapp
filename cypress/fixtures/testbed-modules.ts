import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router"
import { StoreModule} from "@ngrx/store"
import { EffectsModule } from "@ngrx/effects"

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [],
    imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        RouterModule.forRoot([]),

        BrowserAnimationsModule,
    ]
})
export class BudgetTestBedModule { }
