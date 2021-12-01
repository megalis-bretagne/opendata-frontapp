import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';
import {AuthEffects} from './effects/auth.effects';
import {PublicationEffects} from './effects/publication.effects';
import {reducers} from './index';
import {ParametrageEffects} from './effects/parametrage.effects';


@NgModule({
  imports: [
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([ AuthEffects, PublicationEffects, ParametrageEffects]),
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: !environment.production}),
  ],
  exports: [StoreModule]
})
export class StorageModule { }
