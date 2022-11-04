import { EtapeBudgetaire } from "../services/budget.service"

export type Siren = string
export type Siret = string
export type Annee = string

export interface Etablissement {
    denomination: string,
    enseigne?: string,
    est_siege: boolean,
    siret: Siret
}

export interface InfosEtablissements {
    [siret: Siret]: Etablissement
}

export interface RessourcesDisponiblesParSiret {
    [siret: Siret]: EtapeBudgetaire[]
}

export interface RessourcesDisponiblesParAnnees {
    [annee: Annee]: RessourcesDisponiblesParSiret
}

export interface DonneesBudgetairesDisponibles {
    siren: Siren,
    infos_etablissements: InfosEtablissements,
    ressources_disponibles: RessourcesDisponiblesParAnnees
}

/** * @returns liste de siret ayant des données budgetaires disponibles ou tableau vide */
export function donnees_budgetaires_disponibles_sirets(disponibles: DonneesBudgetairesDisponibles, annee?: Annee): Siret[] {

    if (!disponibles 
        || !disponibles.infos_etablissements 
        || !disponibles.ressources_disponibles
        || (annee && !disponibles.ressources_disponibles[annee])) {
        console.warn(`Données budgetaires disponibles invalide`)
        return []
    }

    let etablissements = Object.keys(disponibles.infos_etablissements)
    let etabs_pour_annee = (annee)? Object.keys(disponibles.ressources_disponibles[annee]) : etablissements
    
    let filtered = etablissements.filter(e => etabs_pour_annee.includes(e))
    return filtered
}

/** @returns liste des années ayant des ressources budgetaires associées ou un tableau vide */
export function donnees_budgetaires_disponibles_annees(disponibles: DonneesBudgetairesDisponibles): Annee[] {

    if (!disponibles || !disponibles.ressources_disponibles) {
        console.warn(`Données budgetaires disponibles invalide`)
        return []
    }

    return Object.keys(disponibles.ressources_disponibles)
}

export function donnees_budgetaires_disponibles_etapes(
    disponibles: DonneesBudgetairesDisponibles,
    annee?: Annee | null, siret?: Siret | null,
): EtapeBudgetaire[] {

    if (!disponibles || !disponibles.ressources_disponibles) {
        console.warn(`Données budgetaires disponibles invalide`)
        return []
    }

    let ressources_disponibles = disponibles.ressources_disponibles

    let annees = (annee) ? [annee] : donnees_budgetaires_disponibles_annees(disponibles)
    let etablissements = (siret) ? [siret] : donnees_budgetaires_disponibles_sirets(disponibles)

    let etapes_tmp = new Set<EtapeBudgetaire>()

    for (let annee of annees) {
        let disponible_x_siret = ressources_disponibles[annee]

        for (let siret of etablissements) {

            if (!(siret in disponible_x_siret))
                continue

            let etapes = disponible_x_siret[siret]

            for (let etape of etapes) etapes_tmp.add(etape)
        }
    }

    return [...etapes_tmp];
}