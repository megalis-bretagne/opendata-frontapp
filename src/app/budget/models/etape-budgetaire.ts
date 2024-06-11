export enum EtapeBudgetaire {

  BUDGET_PRIMITIF = "primitif",
  BUDGET_SUPPLEMENTAIRE = "supplémentaire",
  DECISION_MODIFICATIVE = "modificative",
  COMPTE_ADMINISTRATIF = "administratif",
  COMPTE_FINANCIER_UNIQUE = "cfu",
}

export class EtapeBudgetaireUtil {

  public static hasValue(v: string) {
    return Object.values(EtapeBudgetaire).includes(v as EtapeBudgetaire);
  }

  public static fromApi(etape_api: string): EtapeBudgetaire {
    switch (etape_api) {
      case "budget primitif":
        return EtapeBudgetaire.BUDGET_PRIMITIF;
      case "budget supplémentaire":
        return EtapeBudgetaire.BUDGET_SUPPLEMENTAIRE;
      case "décision modificative":
        return EtapeBudgetaire.DECISION_MODIFICATIVE;
      case "compte administratif":
        return EtapeBudgetaire.COMPTE_ADMINISTRATIF;
      case "CFU":
        return EtapeBudgetaire.COMPTE_FINANCIER_UNIQUE;
      default:
        throw new Error(`${etape_api} n'est pas une étape valide`)
    }
  }
}