import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from './settings.service';
import { Settings } from './settings';
import { KeycloakEventType, KeycloakService } from 'keycloak-angular';
import { filter } from 'rxjs/operators';
import { LogIn } from 'src/app/store/actions/auth.actions';
import { Store } from '@ngrx/store';
import { GlobalState } from 'src/app/store/states/global.state';
@Injectable({ providedIn: 'root' })
export class SettingsHttpService {

  constructor(
    private store: Store<GlobalState>,
    private http: HttpClient,
    private settingsService: SettingsService,
    private keycloak: KeycloakService) {
  }

  initializeApp(): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        this.http.get('assets/settings.json')
          .toPromise()
          .then(response => {
              this.settingsService.settings = (response as Settings);
              resolve(true);
            }
          ).catch(error => {
          reject(error);
        });
      }
    ).then(async () => {
      try {
        this.keycloak.keycloakEvents$
          .pipe(
            // tap(evt => console.debug(`[Keycloak events] Received keycloak event ${KeycloakEventType[evt.type]}`)),
            filter(evt => evt.type == KeycloakEventType.OnAuthSuccess),
          )
          .subscribe(_ => {
            // console.debug('[Keycloak events] Dispatch login');
            this.store.dispatch(new LogIn());
          });

        // console.debug('[SettingsHttpService] Initialisation de keycloak');
        await this.keycloak.init({
          config: {
            url: this.settingsService.settings.keycloak.issuer,
            realm: this.settingsService.settings.keycloak.realm,
            clientId: this.settingsService.settings.keycloak.clientId
          },
          initOptions: {
            checkLoginIframe: false,
          },
          bearerPrefix: 'Bearer',
          enableBearerInterceptor: true,
          bearerExcludedUrls: ['/api/v1/budgets'], // C'est une API publique,
                                                   // Il est nécessaire de les whitelister pour ne pas
                                                   // être redirigé vers la page de login de keycloak
        });
      } catch (error) {
        console.error(error);
      }
    });


  }
}
