import {Api, Settings, Keycloak, Budgets} from './settings';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  public settings: Settings;

  constructor() {
    this.settings = new Settings();
    this.settings.api = new Api();
    this.settings.keycloak = new Keycloak();
    this.settings.budgets = new Budgets();
  }

  get budgets(): Budgets {
    if (this.settings && this.settings.budgets)
      return this.settings.budgets
    return new Budgets()
  }

  get budgets_etapes_a_afficher(): string[] {
    if (this.settings && this.settings.budgets && this.settings.budgets.etapes_a_afficher)
      return this.settings.budgets.etapes_a_afficher
    return new Budgets().etapes_a_afficher
  }
}
