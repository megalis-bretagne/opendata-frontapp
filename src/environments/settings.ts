export class Api {
  url = '';
}
export class Keycloak {
  issuer = '';
  realm = '';
  clientId = '';
  urlLogout: '';
}

export class Settings {
  production = false;
  api: Api;
  keycloak: Keycloak;
  urlmarqueblanche: string;
}
