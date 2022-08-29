export namespace Pdc {
    export interface ElementDeNomenclature {
        code: string,
        libelle: string,
        parent_code: string,
    }

    export interface ReferenceFonctionnelle extends ElementDeNomenclature { }
    export interface CompteNature extends ElementDeNomenclature { }

    export interface DonneesNomenclature<T extends ElementDeNomenclature> {
        [code: string]: T
    }

    export type DonneesNomenclatureGenerique = DonneesNomenclature<ElementDeNomenclature>
    export type ReferencesFonctionnelles = DonneesNomenclature<ReferenceFonctionnelle>
    export type ComptesNature = DonneesNomenclature<CompteNature>


    export interface InformationPdc {
        siren: string
        annee: number

        references_fonctionnelles: ReferencesFonctionnelles | {}
        comptes_nature: ComptesNature | {}
    }

    export type TypeNomenclature = "fonctions" | "nature";
    export class Nomenclature {
        constructor(private donnees: DonneesNomenclatureGenerique, public type: TypeNomenclature) { }

        getParentOuLuiMeme(element: ElementDeNomenclature) {
            let _elmt = element;
            while (_elmt.parent_code) {
                _elmt = this.donnees[_elmt.parent_code]
            }
            return _elmt;
        }

        get(code: string) {
            return this.donnees[code];
        }
    }

    /** Extrait une nomenclature à partir des informations de plan de compte
     * @param type  type de nomenclature à extraire. Si aucun type n'est spécifié, on préfèrera la nomenclature fonctionnelle si possible
     * @returns     Une nomenclature
     * @throws      Error si les informations du plan de compte sont inexploitables
     */
    export function extraire_nomenclature(informationPdc: InformationPdc, type: TypeNomenclature | null = null) {

        if (informationPdc.references_fonctionnelles && (type == null || type == "fonctions"))
            return new Nomenclature(informationPdc.references_fonctionnelles, "fonctions");
        else if (informationPdc.comptes_nature && (type == null || type == "nature"))
            return new Nomenclature(informationPdc.comptes_nature, "nature");
        else
            throw Error(`Impossible de déterminer une nomenclature correcte pour ces informations de plan de compte`)
    }
}
