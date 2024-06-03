import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ValiderTableComponent } from './components/valider-table/valider-table.component';
import { ParametrageOrganisationComponent } from './components/parametrage-organisation/parametrage-organisation.component';

import { StorageModule } from './store/storage.module';
import {MaterialModule} from './shared/material.module';
import {SettingsHttpService} from '../environments/settings.http.service';
import { MarqueBlancheComponent } from './components/marque-blanche/marque-blanche.component';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { DialogBoxComponent } from './components/dialog-box/dialog-box.component';
import { BudgetModule } from './budget/budget.module';



@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ParametrageOrganisationComponent,
    ValiderTableComponent,
    MarqueBlancheComponent,
    DialogBoxComponent,
  ],
  imports: [
      BrowserModule,
      StorageModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      KeycloakAngularModule,
      HttpClientModule,
      MaterialModule,
      BrowserAnimationsModule,
      ClipboardModule,
      BudgetModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: app_Init,
      deps: [SettingsHttpService, KeycloakService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function app_Init(settingsHttpService: SettingsHttpService): () => Promise<any>{
  return () => settingsHttpService.initializeApp();
}
