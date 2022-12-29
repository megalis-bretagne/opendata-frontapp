import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Annee } from "../../models/common-types";
import { Pdc } from "../../models/plan-de-comptes";
import { CallStates } from "./call-states";

export interface InformationsPdcId {
    annee: Annee,
    nomenclature: string,
}

export function toStrInformationsPdcId(id: InformationsPdcId | Partial<Pdc.InformationsPdc>) {
    return `${id.annee}-${id.nomenclature}`
}

export interface InformationsPdcState extends EntityState<Pdc.InformationsPdc> {
    callStates: CallStates,
}

export const informationsPdcAdapter: EntityAdapter<Pdc.InformationsPdc> = createEntityAdapter<Pdc.InformationsPdc>({
    selectId: (infos) => toStrInformationsPdcId(infos)
})

export const initialInformationsPdcState: InformationsPdcState = informationsPdcAdapter.getInitialState(
    { 
        callStates: {},
    }
)