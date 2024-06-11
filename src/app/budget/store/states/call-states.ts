import { HttpErrorResponse } from "@angular/common/http"

export const enum LoadingState {
    LOADING = 'LOADING',
    LOADED = 'LOADED',
}
export interface ErrorState {
    errorMsg: string | HttpErrorResponse
}

export type CallState = LoadingState | ErrorState

export interface CallStates {
    [k: string|number]: CallState
}

export function copy_and_insert(old: CallStates, k: string|number, v: CallState): CallStates {
    let cloned = Object.assign({}, old)
    cloned[k] = v
    return cloned
}

export function getError(callState: CallState): string | HttpErrorResponse | null {

    if (isInError(callState)) {
        return (callState as ErrorState).errorMsg
    }
    return null
}

export function isInError(callState: CallState): boolean {
    return callState !== undefined && (callState as ErrorState).errorMsg !== undefined
}

export function isNotFound(callState: CallState): boolean {
    
    const es = (callState as ErrorState)
    const errResponse = (es?.errorMsg as unknown as HttpErrorResponse)

    return es !== undefined 
        && errResponse !== undefined
        && errResponse?.status == 404;
}