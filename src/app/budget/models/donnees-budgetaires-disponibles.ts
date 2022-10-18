import { EtapeBudgetaire } from "../services/budget.service"

export interface _Etablissement {
    denomination: string,
    enseigne: string,
    est_siege: boolean,
    siret: string
}

export interface _InfosEtablissements {
    [siret: string]: _Etablissement
}

export interface _RessourcesDisponiblesParSiret {
    [siret: string]: EtapeBudgetaire[]
}

export interface _RessourcesDisponiblesParAnnees {
    [annee: string]: _RessourcesDisponiblesParSiret
}

export interface DonneesBudgetairesDisponibles {
    siren: string,
    infos_etablissements: _InfosEtablissements,
    ressources_disponibles: _RessourcesDisponiblesParAnnees
}
