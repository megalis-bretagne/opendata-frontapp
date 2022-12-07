export class Budgets {
  etapes_a_afficher = ["administratif", "primitif", "modificative"] 
}

export class Api {
  url = '';
}
export class Keycloak {
  issuer = '';
  realm = '';
  clientId = '';
  urlLogout = '';
}

export class Settings {
  production = false;
  api: Api = new Api();
  keycloak: Keycloak = new Keycloak();
  budgets: Budgets = new Budgets();
  urlmarqueblanche: string = '';
}
