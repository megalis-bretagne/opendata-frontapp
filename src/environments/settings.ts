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
  urlmarqueblanche: string = '';
}
