function check_siret(siret: string) {
    if (siret.length != 14)
        throw Error("Le numéro siret doit être 14 chiffres")
}

export function extract_siren(siret: string) {
    check_siret(siret);
    let siren = siret.slice(0,9);
    return siren;
}