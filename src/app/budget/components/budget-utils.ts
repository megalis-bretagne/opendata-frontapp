import { MatSnackBar } from "@angular/material/snack-bar";

/** Wrap un traitement synchrone avec un snack */
export function snackify(
    traitement_fn,
    snackbar: MatSnackBar,
    init_msg: string,
    success_msg: string,
    failure_msg: string,
) {

    let snack_ref = snackbar.open(init_msg, "Cacher", { duration: undefined })
    try {
        traitement_fn()
        snackbar.open(success_msg)
    } catch(err) {
        snackbar.open(failure_msg)
        throw err;
    } finally {
        snack_ref.dismiss()
    }
}

export function snackify_telechargement(
    telechargement_fn,
    snackbar: MatSnackBar,
    nom_fichier: string,
) {
    return snackify(
        telechargement_fn,
        snackbar,
        "Téléchargement en cours",
        `Fichier ${nom_fichier} téléchargé.`,
        "Une erreur s'est produite lors de votre téléchargement.",
    )
}