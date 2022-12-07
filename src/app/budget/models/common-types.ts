export type Siren = string
export type Siret = string
export type Annee = string

function check_siret(siret: Siret) {
    if (siret.length != 14)
        throw Error("Le numéro siret doit être 14 chiffres")
}

export function extract_siren(siret: Siret): Siren {
    check_siret(siret);
    let siren = siret.slice(0,9);
    return siren;
}